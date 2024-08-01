import React, { useEffect, useState } from "react";
import ENDPOINTS from "../../../utility/enpoints";
import { connect } from "react-redux";

const PdfViewer = ({
  src,
  searchQuery,
  pageNumber,
  headers,
  headerContent,
  height,
  fileHeight,
  fileHeightFrame,
  heightFrame = height ? "850" : "720",
  selectedPageNumber,
}) => {
  const [iframeSrc, setIframeSrc] = useState("");
  useEffect(() => {
    const page = selectedPageNumber ? selectedPageNumber : pageNumber;
    if (!Array.isArray(src)) {
      const pdfUrl = encodeURIComponent(src);
      let searchUrl = `${ENDPOINTS.PdfViewer}?file=${pdfUrl}`;
      // let searchUrl = `https://pdffile.javagcai.com/web/viewer.html?file=${pdfUrl}`;
      if (searchQuery || page || headerContent) {
        const queryParams = [];
        if (searchQuery) {
          const encodedSearchQuery = encodeURIComponent(`${searchQuery}`);
          queryParams.push(
            `search=${encodedSearchQuery.toLocaleLowerCase()}&casesensitive=true&phrase=true&wholeword=true&entireword=true&headers=${headers}`
          );
        }
        if (page) {
          queryParams.push(`page=${page}`);
        }
        if (headerContent) {
          queryParams.push(`headerContent=${headerContent}`);
        }
        searchUrl += `#${queryParams.join("&")}`;
      }
      setIframeSrc(searchUrl);
    }
  }, [src, searchQuery, pageNumber, headerContent, selectedPageNumber]);
  return (
    <>
      <div
        style={{
          maxHeight: height ? "100vh" : fileHeight ? "90vh" : "75vh",
          minHeight: height ? "100vh" : fileHeight ? "90vh" : "75vh",
          overflow: "hidden",
        }}
      >
        <iframe
          id="pdfViewer"
          title="PDF Viewer"
          frameBorder="0"
          width={"100%"}
          height={fileHeight ? fileHeightFrame : heightFrame}
          src={iframeSrc}
        />
      </div>
    </>
  );
};

const enhancer = connect(
  (state) => ({
    selectedPageNumber: state.patientDetails?.details?.selectedDosPageNumber,
  }),
  {}
);
export default enhancer(PdfViewer);
