import { useState } from "react";
import PDFViewer from "../components/PDFViewer";
import pdffile from "../assets/files/2100113_의사국_의안과_의안원문.pdf"; // 상대 경로 사용
import styled from "styled-components";
import Uploader from "../components/Uploader";
/**
 * 메인페이지 view
 *
 * @return Element 랜더링 뷰
 */

function HomePage() {
    const [file, setFile] = useState();
    const [pdfFile, setPdfFile] = useState(pdffile);
    const [pdfText, setPdfText] = useState([]);

    const [prevText, setPrevText] = useState<Array<string>>([]);
    const [nextText, setNextText] = useState<Array<string>>([]);
    const handleFileChange = (newFile: any) => {
        const pdfUrl = URL.createObjectURL(newFile);
        setPdfFile(pdfUrl);
        setFile(newFile);
    };

    const categorizeSections = (data: string) => {
        const match = data.match(/현\s*행\s*개\s*정\s*안([\s\S]*)/);
        if (!match) return { prev: [], next: [] };

        const sections = match[1]
            .trim()
            .match(
                /(제\d+(?:조|조의\d*)\(.*?\)([\s\S]*?)(?=제\d+(?:조|조의\d*)\(|$))/g
            );

        const prev: Array<string> = [];
        const next: Array<string> = [];
        const seen: any = new Set();

        if (sections) {
            sections.forEach((section) => {
                const sectionKey = section.split("(")[0].trim(); // "제n조" 추출
                console.log("우헤헤ㅔ헿", section);
                if (!seen.has(sectionKey)) {
                    prev.push(section.trim());
                    seen.add(sectionKey);
                } else {
                    next.push(section.trim());
                }
            });
        }

        setPrevText(prev);
        setNextText(next);
    };

    const handlePdfTextChange = (newText: string) => {
        categorizeSections(newText);
    };

    return (
        <>
            <Wrapper>
                <h4 style={{ marginBottom: "8px" }}>PDF 뷰어 애플리케이션</h4>
                <Uploader
                    title="파일을 첨부해주세요."
                    file={file}
                    setFile={handleFileChange}
                />
                <ContentsWrapper>
                    <PDFViewer
                        pdfPath={pdfFile}
                        handlePdfTextChange={handlePdfTextChange}
                    ></PDFViewer>
                    <TableWrapper>
                        {prevText.length > 0 ? (
                            <div>
                                <h2>신 · 구조문 대비</h2>
                                <Table
                                    border={1}
                                    cellPadding="10"
                                    cellSpacing="0"
                                >
                                    <thead>
                                        <TitleTr>
                                            <TitleTh>현행</TitleTh>
                                            <TitleTh
                                                style={{
                                                    backgroundColor: "#00a8bf",
                                                    borderColor: "#00a8bf",
                                                }}
                                            >
                                                개정안
                                            </TitleTh>
                                        </TitleTr>
                                    </thead>
                                    <Tbody>
                                        {prevText.map((item, index) => (
                                            <tr key={index}>
                                                <Td>{prevText[index]}</Td>
                                                <Td>{nextText[index]}</Td>
                                            </tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </div>
                        ) : (
                            <p>일치하는 신·구조문 데이터가 없습니다</p>
                        )}
                    </TableWrapper>
                </ContentsWrapper>
            </Wrapper>
        </>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ContentsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const Table = styled.table`
    display: flex;
    flex-direction: column;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
`;

const TableWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const Tbody = styled.tbody`
    margin: 10px;
`;

const TitleTr = styled.tr`
    display: flex;
    width: 100%;
`;

const TitleTh = styled.th`
    width: 50%;
    justify-content: center;
    border-radius: 6px;
    margin: 10px;
    background: #999;
    border-color: #999;
    color: white;
`;

const Td = styled.td`
    margin: 10px;
    width: 50%;
    border: 1px solid #e6e6e6;
    border-radius: 6px;

    &:first-of-type {
        background-color: "red";
        border-right: 2px dashed #e6e6e6;
    }
`;

export default HomePage;
