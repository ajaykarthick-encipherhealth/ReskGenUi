import React, { useEffect } from "react";
import InputField from "../input";

const Search = ({
  searchlabel,
  setSearch,
  setSentSearch,
  setReceivedSearch,
  setCoderSearch,
  activeTab,
  coderSearch,
  receivedSearch,
  sentSearch,
  search,
}) => {
  useEffect(() => {
    if (activeTab) {
      setCoderSearch("");
      setReceivedSearch("");
      setSentSearch("");
    }
  }, [activeTab]);
  return (
    <div>
      <label style={{ marginLeft: "8px" }}>{searchlabel}</label>
      <InputField
        inputValue={
          activeTab === "CoderReport"
            ? coderSearch
            : activeTab === "ReceivedReport"
            ? receivedSearch
            : activeTab === "SentReport"
            ? sentSearch
            : search
        }
        setInputValue={
          activeTab === "CoderReport"
            ? setCoderSearch
            : activeTab === "ReceivedReport"
            ? setReceivedSearch
            : activeTab === "SentReport"
            ? setSentSearch
            : setSearch
        }
        delay={1000}
        type="text"
        placeholder="Search"
        isSearch={true}
      />
    </div>
  );
};

export default Search;
