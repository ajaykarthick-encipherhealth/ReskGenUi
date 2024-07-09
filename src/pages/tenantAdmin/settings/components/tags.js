import React from "react";
import { Tag, Button, Popconfirm, Input } from "antd";
import Image from "next/image";
import delIcon from '../../../../images/svg/delIcon.svg'
import edit from '../../../../images/svg/editWithoutBg.svg'
const Tags = ({
  tag,
  index,
  handleRemoveTag,
  handleEditTag,
  editIndex,
  editValue,
  handleEditInputChange,
  handleSaveEdit,
}) => {
  return (
    <div className="mb-2 mr-2" style={{ display: "inline-block" }}>
      {editIndex === index ? (
        <Input
          placeholder=""
          isSearch={false}
          handleInputStr={handleEditInputChange}
          name="input"
          defaultValue={editValue}
          onBlur={() => handleSaveEdit(index)}
          onPressEnter={() => handleSaveEdit(index)}
          className="mr-2 w-auto p-2.5"
        />
      ) : (
        <div className="d-flex">
          <Tag
            className="flex justify-center p-2 py-1 fs-5"
            style={{
              background: "#BAE0FC",
              padding: "10px",
              textAlign: "center",
            }}
            closable={false}
            onClose={() => handleRemoveTag(index)}
          >
            <span className="p-2">{tag}</span>
            <Button
              size="small"
              type="link"
              onClick={() => handleEditTag(index)}
              style={{padding:"0px"}}
              
            >
            
              <Image src={edit} alt="noimg"/>  
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this tag?"
              onConfirm={() => handleRemoveTag(index)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                type="link"
                style={{padding:"0px"}}
              >
               <Image src={delIcon} alt="noimg"/>  
              </Button>
            </Popconfirm>
          </Tag>
        </div>
      )}
    </div>
  );
};

export default Tags;
