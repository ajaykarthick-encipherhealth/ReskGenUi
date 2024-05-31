import React, { useState } from "react";
import style from "./style.module.css";
import { Spin, Table } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const Tables = (props) => {
  const { codeData, setCodeData, loading, setLoading } = props;

  const handleViewTable = (tableData) => {
    setLoading(true);
    setCodeData({
      ...codeData,
      name: tableData?.name,
      desc: tableData?.desc,
      excludes1: tableData?.excludes1,
      children: tableData?.children,
      inclusionTerm: tableData?.inclusionTerm,
    });
    setLoading(false);
  };

  const columns = [
    {
      title: "Include",
      dataIndex: "inclusionTerm",
      key: "inclusionTerm",
    },
    {
      title: "Exclude 1",
      dataIndex: "excludes1",
      key: "excludes1",
    },
    {
      title: "Exclude 2",
      dataIndex: "excludes2",
      key: "excludes2",
    },
  ];
  return (
    <div>
      <div className="d-flex justify-content-center">
        {loading && <Spin size="large" />}
      </div>
      {(codeData?.excludes1 || codeData?.inclusionTerm) && (
        <div className={`${style.card} mt-2`}>
          <div className={style.head}>
            {codeData?.name} {codeData?.desc}
          </div>
          <div className={`${style.tables}mt-3`}>
            <Table
              dataSource={[codeData]}
              columns={columns}
              pagination={false}
            />
          </div>
          {/* <div className={`${style.table} tablestyle`}>
            <table className="table table-bordered tableheader">
              <tr>
                <th
                  className="tablehead"
                  style={{
                    background: "#6A8D20",
                    color: "white",
                    fontSize: "15px",
                  }}
                >
                  Include
                </th>

                <th className={style.header2}>Exclude1</th>
                <th className={style.header3}>Exclude2</th>
              </tr>
              <tbody>
                <tr>
                  <td style={{ textWrap: "wrap" }}>
                    {codeData?.inclusionTerm}
                  </td>

                  {codeData?.excludes1 && (
                    <td style={{ textWrap: "wrap" }}>{codeData?.excludes1}</td>
                  )}
                  {codeData?.excludes2 && (
                    <td style={{ textWrap: "wrap" }}>{codeData?.excludes2}</td>
                  )}
                </tr>
              </tbody>
            </table>
          </div> */}
        </div>
      )}

      <div className={style.list}>
        {codeData?.children?.map((s, i) => (
          <div key={i}>
            <div onClick={() => handleViewTable(s)}>
              <p className={`${style.card} mt-3`}>
                <ArrowRightOutlined />
                <span className={style.codes}>{s.name} </span>
                <span>- {s.desc}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
