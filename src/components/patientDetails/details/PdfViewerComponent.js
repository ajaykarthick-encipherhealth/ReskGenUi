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
  heightFrame = "100%",
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
      console.log(searchUrl)
    }
  }, [src, searchQuery, pageNumber, headerContent, selectedPageNumber]);
  return (
    <>
      <div
        style={{
          maxHeight: "75vh",
          minHeight: "75vh",
          overflow: "hidden",
        }}
      >
        <iframe
          id="pdfViewer"
          title="PDF Viewer"
          frameBorder="0"
          width={"100%"}
          height={"710px"}
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
