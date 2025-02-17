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
  setPageNo,
  id = "search",
  name = "search",
  value,
}) => {
  return (
    <div>
      <label
        style={{ marginLeft: "8px" ,marginBottom:"3px"}}
        className="text-truncate responsiveLabel"
      >
        {searchlabel}
      </label>
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
        id={id}
        name={name}
        value={value}
      />
    </div>
  );
};

export default Search;
