import React, { useEffect, useState } from "react";
import ENDPOINTS from "../../../../utility/enpoints";

const PdfViewer = ({ src, searchQuery, pageNumber }) => {
  const [iframeSrc, setIframeSrc] = useState("");
  useEffect(() => {
    if (src) {
      const pdfUrl = encodeURIComponent(src);
      let searchUrl = `${ENDPOINTS.PdfViewer}?file=${pdfUrl}`;
      // let searchUrl = `https://pdffile.javagcai.com/web/viewer.html?file=${pdfUrl}`;
      if (searchQuery || pageNumber) {
        const queryParams = [];
        if (searchQuery) {
          const encodedSearchQuery = encodeURIComponent(`${searchQuery}`);
          queryParams.push(
            `search=${encodedSearchQuery}&casesensitive=true&phrase=true&wholeword=true&entireword=true`
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
      <iframe
        id="pdfViewer"
        title="PDF Viewer"
        frameBorder="0"
        width={'100%'}
        height="700"
        src={iframeSrc}
      />
    </>
  );
};

export default PdfViewer;
