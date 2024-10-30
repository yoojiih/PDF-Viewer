import React, { useEffect, useState } from "react";
import PDFViewer from "../components/PDFViewer";

/**
 * 메인페이지 view
 *
 * @return Element 랜더링 뷰
 */

function HomePage() {
    return <PDFViewer pdfPath={"../../public/2100113.pdf"}></PDFViewer>;
}
export default HomePage;
