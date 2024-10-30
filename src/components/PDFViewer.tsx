import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs";
// Worker 설정

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type CanvasProps = {
    width: number;
    height: number;
};

type PDFViewerProps = {
    pdfPath: string;
};

const PDFViewer = ({ pdfPath }: PDFViewerProps) => {
    console.log(pdfPath);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [page, setPage] = useState<number>(1);

    const getFileURL = (path: string) => {};

    const drawCanvas = useCallback(
        ({ width, height }: CanvasProps) => {
            if (!canvasRef.current) {
                throw new Error("canvasRef가 없음");
            }
            const canvas: HTMLCanvasElement = canvasRef.current;
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");
            if (context) {
                console.log("contex 생성 성공!");
                return context;
            } else {
                throw new Error("canvas context가 없음");
            }
        },
        [canvasRef]
    );

    const renderPage = useCallback(
        async (doc: pdfjsLib.PDFDocumentProxy) => {
            const currentPage = await doc.getPage(page);
            const viewport = currentPage.getViewport({ scale: 1.0 }); // each pdf has its own viewport
            const context = drawCanvas({
                width: viewport.width,
                height: viewport.height,
            });

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await currentPage.render(renderContext).promise;
            console.log(`${page}로딩 성공`);
        },
        [page, drawCanvas]
    );

    const getPDF = useCallback(
        async (pdfPath: string) => {
            try {
                const loadingTask = pdfjsLib.getDocument(pdfPath);
                const doc = await loadingTask.promise;

                const pageNum = doc.numPages;
                console.log(`document 로딩 성공: 전체 페이지 ${pageNum}`);

                renderPage(doc);
                console.log("pdf 로딩 성공이라네");
            } catch (e) {
                console.log("pdf 로딩 실패!");
                console.log(e);
            }
        },
        [renderPage]
    );

    useEffect(() => {
        getPDF(pdfPath);
    }, [pdfPath]);

    return (
        <div>
            <canvas ref={canvasRef} style={{ height: "100vh" }} />
        </div>
    );
};

export default PDFViewer;
