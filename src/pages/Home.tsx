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
    const handleFileChange = (newFile: any) => {
        const pdfUrl = URL.createObjectURL(newFile);
        setPdfFile(pdfUrl);
        setFile(newFile);
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
                    <PDFViewer pdfPath={pdfFile}></PDFViewer>
                    <TableWrapper></TableWrapper>
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

const TableWrapper = styled.div`
    display: flex;
    width: 100%;
`;

const label = styled.label`
    display: inline-block;
    font-size: 14px;
    line-height: 48px;
    padding-left: 16px;
    box-sizing: border-box;
    position: relative;
    border-radius: 12px;
    border: 1px solid var(--neutral-light-darkest, #c5c6cc);
    color: "#8F9098";
    width: 784px;
    height: 48px;
`;

export default HomePage;
