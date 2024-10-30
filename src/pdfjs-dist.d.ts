declare module "pdfjs-dist/build/pdf.worker.mjs" {
    const worker: any; // 정확한 타입을 정의할 수 있다면 수정
    export default worker;
}

declare module "pdfjs-dist" {
    namespace pdfjsLib {
        const GlobalWorkerOptions: {
            workerSrc: string;
        };
    }

    export = pdfjsLib;

    export interface PDFPageProxy {
        getViewport(options: { scale: number }): any; // 실제 타입을 필요에 맞게 조정
        render(renderContext: any): { promise: Promise<void> }; // 실제 타입을 필요에 맞게 조정
        getTextContent(): Promise<any>;
        // 필요한 메소드 및 속성을 추가하세요.
    }

    export interface PDFDocumentProxy {
        getPage(pageNumber: number): Promise<PDFPageProxy>;
        numPages: number;
        // 필요한 다른 메소드와 속성을 추가하세요.
    }
    export function getDocument(url: string | Object): {
        promise: Promise<PDFDocumentProxy>;
    };
}

// declare module "pdfjs-dist/build/pdf" {
//     export interface PDFPageProxy {
//         getViewport(options: { scale: number }): any; // 실제 타입에 맞게 수정 가능
//         render(renderContext: any): { promise: Promise<void> }; // 실제 타입에 맞게 수정 가능
//     }

//     export interface PDFDocumentProxy {
//         getPage(pageNumber: number): Promise<PDFPageProxy>;
//         numPages: number;
//     }

//     export function getDocument(url: string | object): {
//         promise: Promise<PDFDocumentProxy>;
//     };

//     export const GlobalWorkerOptions: {
//         workerSrc: string;
//     };
// }
