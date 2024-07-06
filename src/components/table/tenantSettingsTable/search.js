import { Input } from "antd";
import React from "react";

const Search = ({ setSearch }) => {
  return (
    <div>
      <Input
        placeholder="input search text"
        size="large"
        onChange={(e) => setSearch(e.target.value)}
        // style={{ height: "58px" }}
        // prefix={prefix}
        // suffix={suffix}

        // onSearch={onSearch}
      />
    </div>
  );
};

export default Search;
