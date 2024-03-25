import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputText } from "primereact/inputtext";
import { searchFunction } from "../headerFilters/functions";
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
  search

}) => {

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
