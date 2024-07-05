import React, { useEffect, useState } from "react";
import InputField from "../input";

const Search = ({
  searchlabel,
  setSearch,
  setSentSearch,
  setReceivedSearch,
  setCoderSearch,
  activeTab,
  searchVal, 
  setSearchVal,
  setPageNo
}) => {
  return (
    <div>
      <label style={{ marginLeft: "8px" }}>{searchlabel}</label>
      <InputField
        delay={1000}
        type="text"
        placeholder="Search"
        isSearch={true}
        activeTab={activeTab}
        setSentSearch={setSentSearch}
        setReceivedSearch={setReceivedSearch}
        setCoderSearch={setCoderSearch}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        setInputValue={setSearch}
        setPageNo={setPageNo}
      />
    </div>
  );
};

export default Search;
