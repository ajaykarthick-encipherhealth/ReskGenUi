import React, { useEffect, useState } from "react";

const PdfViewer = ({ src, searchQuery, pageNumber }) => {
  const [iframeSrc, setIframeSrc] = useState("");
  useEffect(() => {
    if (src) {
      const pdfUrl = encodeURIComponent(src);
      let searchUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${pdfUrl}`;
      if (searchQuery || pageNumber) {
        const queryParams = [];
        if (searchQuery) {
          const encodedSearchQuery = encodeURIComponent(`${searchQuery}`);
          queryParams.push(
            `search=${encodedSearchQuery}&caseSensitive=true&phrase=true&wholeWord=true&entireWord=true`
          );
        }
        if (pageNumber) {
          queryParams.push(`page=${pageNumber}`);
        }
        searchUrl += `#${queryParams.join("&")}`;
      }

      setIframeSrc(searchUrl);
    }
  }, [src, searchQuery, pageNumber]);
  return (
    <>
      <div
        style={{
          width: "40px",
          height: "30px",
          position: "relative",
          left: "710px",
          right: "0px",
          top: "0px",
          background: "rgba(249,249,249,250)",
        }}
      ></div>
      <iframe
        id="pdfViewer"
        title="PDF Viewer"
        frameBorder="0"
        width="750"
        height="700"
        src={iframeSrc}
        style={{ marginTop: "-30px" }}
      />
    </>
  );
};

export default PdfViewer;
