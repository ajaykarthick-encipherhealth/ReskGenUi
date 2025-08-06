import React from "react";
import Layout from "../../layout";

const Widget = (props) => {
  const { selectedTab, selecteItem, setSelectedItem, handleSelect, selectedRole } = props;
  return (
    <div>
      <Layout {...props} />
    </div>
  );
};

export default Widget;
