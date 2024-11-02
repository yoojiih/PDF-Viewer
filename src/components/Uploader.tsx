import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface BasicFileUploadProps {
    file: File;
    setFile: any;
    fileSize: number;
    title?: string;
    imgSize?: string;
    width?: string;
}

Uploader.defaultProps = {
    file: null,
    setFile: null,
    fileSize: 50,
    title: "타이틀을 입력해주세요",
    imgSize: "권장 사이즈",
    fileType: [],
    width: "540px",
};

function Uploader({
    file,
    setFile,
    fileSize,
    title,
    imgSize,
    width,
}: BasicFileUploadProps): React.ReactElement {
    const inputRef: any = React.useRef(null);
    const [acceptFileType, setAcceptFileType] = useState("");

    const [fileName, setFileName] = useState(file ? file.name : title);

    const handleChange = function (e: any) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const [alertText, setAlertText] = useState("");

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleFiles = async (files: any) => {
        // if (!validateFile(files[0])) return;
        setFileName(files[0].name);
        setFile(files[0]);
        // ref 초기화
        inputRef.current.value = "";
    };

    const deleteFile = () => {
        setFile(null);
    };

    useEffect(() => {
        if (!file) setFileName(title);
    }, [file]);

    return (
        <>
            {file === null ? (
                <FileInputBtn onClick={onButtonClick}>
                    <span>{fileName}</span>
                </FileInputBtn>
            ) : (
                <FileInputBtn onClick={deleteFile}>
                    <span>{fileName}</span>
                </FileInputBtn>
            )}
            <input
                ref={inputRef}
                type="file"
                id="uploadFile"
                accept="application/pdf"
                onChange={handleChange}
                style={{ display: "none" }}
            />
        </>
    );
}

const FileInputBtn = styled.button`
    display: flex;
    min-width: 200px;
    padding: 30px;
    height: 44px;
    margin: 10px 0;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background-color: var(--input-focus);
    cursor: pointer;
    span {
        font-size: 16px;
        text-align: center;
    }
`;

export default Uploader;
