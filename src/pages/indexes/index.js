import React, { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import style from "./style.module.css";
import {
  CarryOutOutlined,
  CheckOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Tree } from "antd";

const Code = () => {
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const treeData = [
    {
      title: <span className={style.title}> Failure, failed</span>,
      key: "0-0",
      icon: <CarryOutOutlined />,
      children: [
        {
          title: (
            <span className={style.title}>
              abortion - see Abortion, attempted
            </span>
          ),
        },
        {
          title: <span className={style.title}>aortic (valve)I35.8</span>,
        },
        {
          title: (
            <span className={style.title}>
              attempted abortion - see Abortion, attempted
            </span>
          ),
        },
        {
          title: <span className={style.title}>biventricular I50.82</span>,
        },
        {
          title: (
            <span className={style.title}>
              to thrive (child over 28 days old) R62.51
            </span>
          ),
          key: "0-0-0",
          icon: <CarryOutOutlined />,
          children: [
            {
              title: <span className={style.title}>adult R62.7</span>,
              key: "0-0-0-0",
              icon: <CarryOutOutlined />,
            },
            {
              title: <span className={style.title}>newborn P92.6</span>,
              key: "0-0-2-1",
              icon: <CarryOutOutlined />,
            },
          ],
        },
        {
          title: (
            <span className={style.title}>cardiac - see Failure, heart</span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              cardiorespiratory - see Also Failure heart R09.2
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              cardiovascular (chronic) - see Failure, heart
            </span>
          ),
        },
        {
          title: <span className={style.title}>cerebrovascular I67.9</span>,
        },
        {
          title: (
            <span className={style.title}>
              cervical dilatation in labor O62.0
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              circulation, circulatory (peripheral) R57.9
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              compensation - see Disease, heart
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              congestive - see Failure, heart, congestive
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              dental implant (endosseous) M27.69
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              descent of head (at term) of pregnancy (mother) O32.4
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              endosseous dental implant - see Failure, dental implant
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              engagement of head (term of pregnancy) (mother) O32.4
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              examination(s), anxiety concerning Z55.2
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              gain weight (child over 28 days old) R62.51
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>genital response (male) F52.21</span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              heart (acute) (senile) (sudden) I50.9
            </span>
          ),
        },
        {
          title: (
            <span className={style.title}>
              left (ventricular) - see Also Failure ventricular left
            </span>
          ),
        },
      ],
    },
  ];

  return (
    <div className="container-fluid">
      <div className={style.text}>
        <div>
          {" "}
          <ArrowLeftOutlined />
        </div>
        Results from CogentAI for Failure
      </div>
      <div className="mt-3">
        <div className={style.head}>ICD-10-CM Diseases and Injuries</div>
        <div className="mt-3 antdstyle">
          <Tree
            showLine={true}
            defaultExpandedKeys={["0-0-0"]}
            onSelect={onSelect}
            treeData={treeData}
          />
        </div>
        {/* <div className="container">
          <div
            className="mt-5"
            style={{
              border: "1px solid #0F6ADB",
              height: "220px",
              width: "100%",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px  5px 5px",
              borderRadius: "5px",
            }}
          >
            <div className={style.card}>
            <div className="d-flex gap-3 ">
                <div className={style.heading}>Other nonrheumatic aortic valve disorders</div>
         
                <div className={style.subhead}>I35 - Parent Code Notes</div>
             
             
              
              
            </div>
            </div>
              
            <div className="d-flex align-items-center justify-content-center mt-3">
        <div className={style.border}>
        <div className={style.para}>
            Exclude 1
          </div>
         
            <ul className={style.list}>
              <li>1.aortic valve disorder of unspecified cause but with diseases of mitral and/or tricuspid valve(s) (I08)</li>
            <li>2.aortic valve disorder specified as congenital (Q23.0,Q23.1)</li>
            <li>3.aortic valve disorder specified as rheumatic (I06)</li>
            <li>4.hypertrophic sub aortic stenosis (I42.1)</li>
            </ul>
        </div>
        </div>
          </div>
         
        </div> */}
        
      </div>
    </div>
  );
};

export default Code;
