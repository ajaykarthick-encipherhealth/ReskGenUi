import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Style from "./style.module.css";
import { pdfControl, portalPdfUrl } from "../../../utils/config";
import { pdfEncrypt } from "../../headerFilters/functions";
import { getStorage } from "../../../utils/storages";
import { serverControl } from "../../..//utils/config";
import { Skeleton } from "antd";
import Tabs from "../../tabs/Tabs";
import EmptyComponent from "../../EmptyComponent";

const items = [
  {
    fileSource: "File",
  },
  {
    fileSource: "Summary",
  },
];

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
  patientDetailsResult,
}) => {
  const [iframeSrc, setIframeSrc] = useState("");
  const [emptyText, setEmptyText] = useState(false);
  const [fileId, setFileId] = useState("");
  const [url, setUrl] = useState("");
  const [ids, setIds] = useState();
  const [activeTab, setActiveTab] = useState(items[0]);

  useEffect(() => {
    const page = selectedPageNumber ? selectedPageNumber : pageNumber;
    const header = {
      "X-Role-Id": getStorage("roleId"),
      "X-Client": getStorage("client"),
      "X-Org": getStorage("orgId"),
      "X-Project": getStorage("project"),
      "X-Org-based": "true",
    };
    if (!Array.isArray(src)) {
      const getData = pdfEncrypt(getStorage("fileId"));
      const pdfUrl = encodeURIComponent(getData.pass);
      let searchUrl = "";
      if (fileId != getStorage("fileId")) {
        setFileId(getStorage("fileId"));
        setUrl(pdfUrl);
        setIds(getData.iv);
        searchUrl = `${portalPdfUrl}?file=${pdfUrl}&salt=${
          getData.iv
        }&token=${getStorage(
          "token"
        )}&baseEnv=${serverControl}&pdfEnv=${pdfControl}&header=${JSON.stringify(
          header
        )}`;
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
      } else {
        searchUrl = `${portalPdfUrl}?file=${url}&salt=${ids}&token=${getStorage(
          "token"
        )}&baseEnv=${serverControl}&pdfEnv=${pdfControl}&header=${JSON.stringify(
          header
        )}`;
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
      }
      setIframeSrc(searchUrl);
    } else {
      setTimeout(() => {
        setEmptyText(true);
      }, 1000);
    }
  }, [src, searchQuery, pageNumber, headerContent, selectedPageNumber]);

  const onChangeTabs = (item) => {
    setActiveTab(item);
  };

  return (
    <>
      {/* <div className="">
        <Tabs
          tabsList={items}
          activeTab={activeTab}
          onChangeTabs={onChangeTabs}
        />
      </div> */}
      {activeTab.fileSource == "Summary" ? (
        <div>
          {patientDetailsResult?.summary ? (
            <div>{patientDetailsResult?.summary}</div>
          ) : (
            <EmptyComponent/>
          )}
        </div>
      ) : iframeSrc ? (
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
            <Skeleton.Input
              className="w-100"
              style={{ height: "900px" }}
              active
            />
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
    patientDetailsResult:
      state?.patientDetails?.details?.patientResult?.data?.response,
  }),
  {}
);
export default enhancer(PdfViewer);
