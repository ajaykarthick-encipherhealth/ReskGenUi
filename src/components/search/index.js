import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputText } from "primereact/inputtext";

const Search = ({ searchlabel, handleSearch }) => {
  return (
    <div>
      <label>{searchlabel}</label>
      <div class="form-group has-search">
        <FontAwesomeIcon
          className="fa fa-search form-control-feedback"
          icon={faSearch}
        />
        <InputText
          type="text"
          onChange={(e) => handleSearch(e)}
          className="form-control new-form-control"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default Search;