import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./styles.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function MyApp() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const pdfPath = require("./Gymnasium-Buckhorn-bll-final.pdf");

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Documentation</h1>
      <div
        className={`${styles.pdfContainer} ${isMobile ? "" : styles.centered}`}
      >
        <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            height={isMobile ? 500 : null}
            renderAnnotationLayer={false}
            renderInteractiveForms={false}
            renderTextLayer={false}
          />
        </Document>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={goToPreviousPage}
          disabled={pageNumber === 1}
        >
          Previous Page
        </button>
        <span className={styles.pageNumber}>
          Page {pageNumber} of {numPages}
        </span>
        <button
          className={styles.button}
          onClick={goToNextPage}
          disabled={pageNumber === numPages}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default MyApp;
