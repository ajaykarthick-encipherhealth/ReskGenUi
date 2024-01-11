import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputText } from "primereact/inputtext";
import { searchFunction } from "../headerFilters/functions";

const Search = ({ searchlabel, setSearch }) => {
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
          onChange={(e) => searchFunction(e,setSearch)}
          className="form-control new-form-control"
          placeholder="Search"
        />
      </div>
    </div>
  );
};

export default Search;