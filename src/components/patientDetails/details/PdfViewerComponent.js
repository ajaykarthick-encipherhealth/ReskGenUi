import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import ENDPOINTS from "../../../utility/enpoints";
import { connect } from "react-redux";
import Style from "./style.module.css";

const PdfViewer = ({
  src,
  searchQuery,
  pageNumber,
  headers,
  headerContent,
  fileHeightFrames,
  fileHeights,
  selectedPageNumber,
  isFillView,
}) => {
  const [iframeSrc, setIframeSrc] = useState("");
  const [emptyText, setEmptyText] = useState(false);
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
    } else {
      setTimeout(() => {
        setEmptyText(true);
      }, 1000);
    }
  }, [src, searchQuery, pageNumber, headerContent, selectedPageNumber]);
  return (
    <>
      {iframeSrc ? (
        <div
          // style={{
          //   maxHeight: fileHeights ? fileHeights : "75vh",
          //   minHeight: fileHeights ? fileHeights : "75vh",
          //   overflow: "hidden",
          // }}
          className={
            isFillView ? Style.pdfViewerContainerHalf : Style.pdfViewerContainer
          }
        >
          <iframe
            id="pdfViewer"
            title="PDF Viewer"
            frameBorder="0"
            width={"100%"}
            // height={fileHeightFrames ? fileHeightFrames : "710px"}
            src={iframeSrc}
          />
        </div>
      ) : (
        <div className={Style.emptyFileView}>
          {!emptyText ? (
            <div className={Style?.loaderDiv}>
              <Spinner />
            </div>
          ) : (
            <span>File Not Found</span>
          )}
        </div>
      )}
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
