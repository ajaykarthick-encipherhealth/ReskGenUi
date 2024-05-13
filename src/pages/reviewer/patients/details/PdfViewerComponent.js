import React, { useEffect, useState } from "react";
import ENDPOINTS from "../../../../utility/enpoints";

const PdfViewer = ({ src, searchQuery, pageNumber, headers,headerContent }) => {
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    if (!Array.isArray(src)) {
      const pdfUrl = encodeURIComponent(src);
      let searchUrl = `${ENDPOINTS.PdfViewer}?file=${pdfUrl}`;
      // let searchUrl = `https://pdffile.javagcai.com/web/viewer.html?file=${pdfUrl}`;
      if (searchQuery || pageNumber || headerContent) {
        const queryParams = [];
        if (searchQuery) {
          const encodedSearchQuery = encodeURIComponent(`${searchQuery}`);
          queryParams.push(
            `search=${encodedSearchQuery.toLocaleLowerCase()}&casesensitive=true&phrase=true&wholeword=true&entireword=true&headers=${headers}`
          );
        }
        if (pageNumber) {
          queryParams.push(`page=${pageNumber}`);
        }
        if(headerContent){
          queryParams.push(`headerContent=${headerContent}`)
        }
        searchUrl += `#${queryParams.join("&")}`;
      }
      setIframeSrc(searchUrl);
    }
  }, [src, searchQuery, pageNumber,headerContent]);
  return (
    <>
      <div style={{height:"70vh",overflow:"hidden"}}>
        <iframe
          id="pdfViewer"
          title="PDF Viewer"
          frameBorder="0"
          width={"100%"}
          height="700"
          src={iframeSrc}
        />
      </div>
    </>
  );
};

export default PdfViewer;
