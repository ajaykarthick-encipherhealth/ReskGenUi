import styled from "styled-components";

export const BtnContainer = styled.div`
  border-radius: 16px;
  background-color: #f4ebf4;
  display: flex;
  height: 35px;
`;
export const Button = styled.label`
  width: 94px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  cursor: pointer;
  background-color: ${(props) =>
    props?.active === "active" ? props.activeBg : props.inActiveBg};
  color: ${(props) =>
    props?.active === "active" ? props.activeColor : props.inActiveColor};
  border-radius: ${(props) => (props?.active === "active" ? "16px" : "16px")};
  border: none;
`;
