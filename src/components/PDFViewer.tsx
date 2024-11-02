import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import styled from "styled-components";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs";
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

type PDFViewerProps = {
    pdfPath: string;
    file?: File;
    handlePdfTextChange?: any;
};

const PDFViewer = ({ pdfPath, handlePdfTextChange, file }: PDFViewerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const drawCanvas = useCallback(
        ({ width, height }: { width: number; height: number }) => {
            const canvas = canvasRef.current;
            if (!canvas) {
                throw new Error("canvasRef가 없음");
            }
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");
            if (!context) {
                throw new Error("canvas context가 없음");
            }
            return context;
        },
        [canvasRef]
    );

    const renderPage = useCallback(
        async (doc: any, pageNum: number) => {
            setLoading(true);
            try {
                const currentPage = await doc.getPage(pageNum);
                const viewport = currentPage.getViewport({ scale: 1.0 });
                const context = drawCanvas({
                    width: viewport.width,
                    height: viewport.height,
                });

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await currentPage.render(renderContext).promise;
                console.log(`${pageNum} 로딩 성공`);
            } catch (error) {
                console.error(`페이지 ${pageNum} 로딩 실패`, error);
            } finally {
                setLoading(false);
            }
        },
        [drawCanvas]
    );

    const getPDF = useCallback(
        async (pdfPath: string) => {
            try {
                const loadingTask = pdfjsLib.getDocument(pdfPath);
                const doc = await loadingTask.promise;

                if (doc && typeof doc.getPage === "function") {
                    const numPages = doc.numPages;
                    setTotalPages(numPages);
                    console.log(`document 로딩 성공: 전체 페이지 ${numPages}`);
                    await renderPage(doc, page);
                    console.log("pdf 로딩 성공");
                    let pdfText = "";
                    for (let i = 1; i <= doc.numPages; i++) {
                        const page = await doc.getPage(i);
                        const content = await page.getTextContent();
                        const pageText = content.items
                            .map((item: any) => item.str)
                            .join(" ");
                        pdfText += pageText + "\n"; // 각 페이지의 텍스트를 이어 붙임
                    }
                    handlePdfTextChange(pdfText);
                } else {
                    console.error("문서 객체가 올바르지 않습니다.", doc);
                }
            } catch (error) {
                console.error("pdf 로딩 실패!", error);
            }
        },
        [renderPage, page]
    );

    useEffect(() => {
        getPDF(pdfPath);
    }, [pdfPath, getPDF]);

    useEffect(() => {
        const loadPage = async () => {
            if (totalPages > 0) {
                await renderPage(pdfPath, page);
            }
        };
        loadPage();
    }, [page, totalPages, pdfPath, renderPage]);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    return (
        <Wrapper>
            <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "100vh" }}
            />
            <div>
                <button
                    onClick={handlePrevPage}
                    disabled={page <= 1 || loading}
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={page >= totalPages || loading}
                >
                    Next
                </button>
                <p>
                    Page {page} of {totalPages}
                </p>
                {loading && <p>Loading...</p>}
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export default PDFViewer;
