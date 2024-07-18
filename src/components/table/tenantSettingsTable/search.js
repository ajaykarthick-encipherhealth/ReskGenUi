import { Input } from "antd";
import React from "react";

const Search = ({ setSearch, value }) => {
  return (
    <div>
      <Input
        placeholder="Search....!"
        size="large"
        onChange={(e) => setSearch(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default Search;
