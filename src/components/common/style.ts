// This file contains common styled components

import styled from "styled-components";
import { appColors } from "../../app/helpers";

export const StyledInput = styled.input`
  box-sizing: border-box;
  border-radius: 3px;
  padding: 8px;
  border: 2px solid;
  width: 100%;
  outline: none;
  font-size: 16px;
  transition: 0.05s;
  color: ${appColors.black};
  border-color: ${appColors.lightGray};
  background-color: #fff;
  &:hover {
    border-color: ${appColors.darkGray};
    transition: 0.05s;
  }
  &:focus {
    border-color: ${appColors.primary};
    transition: 0.05s;
  }
`;
export const FormGroup = styled.div<{ dsp?: string; alignItems?: string }>`
  margin-bottom: 15px;
  &:last-child {
    margin-top: 30px;
    margin-bottom: 0;
  }
  &.form-btns > * {
    flex: 1;
    justify-content: center;
  }
  ${({ dsp, alignItems }) => {
    if (dsp === "flex")
      return `display: flex;
              align-items: ${alignItems || "center"}; 
              justify-content: space-between;
              gap: 20px;
              `;
  }};
  h4 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  span {
    font-weight: 500;
  }
`;
export const StyledErrorMessage = styled.span`
  color: ${appColors.error};
  font-size: 13px;
`;
export const StyledIcon = styled.span`
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
`;
