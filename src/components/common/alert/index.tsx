import { createPortal } from "react-dom";
import styled from "styled-components";
import { portalRoot } from "../../..";
import { MdClose } from "react-icons/md";
import { useEffect } from "react";
import { appColors } from "../../../app/helpers";

type AlertColors = {
  bgColor: string;
  textColor: string;
};

type AlertPropTypes = {
  Icon: () => JSX.Element;
  text: string;
  colors: AlertColors;
  timeout?: number;
  onClose: () => void;
  open: boolean;
};

type StyledAlertPropTypes = {
  colors: AlertColors;
  open: boolean;
};

const StyledAlert = styled.div<StyledAlertPropTypes>`
  position: fixed;
  top: 50px;
  right: 50px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  gap: 30px;
  background-color: ${({ colors }) => colors.bgColor};
  color: ${({ colors }) => colors.textColor};
  padding: 10px 20px;
  border-radius: 5px;
  .alert-close-btn {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    color: ${({ colors }) => colors.textColor};
    cursor: pointer;
    height: 100%;
    border-radius: 50%;
  }
  .alert-close-btn:hover {
    background-color: ${appColors.primaryDark};
  }
`;
const AlertInfo = styled.div`
  display: flex;
  display: -webkit-flex;
  align-items: center;
  gap: 5px;
`;

export const Alert: React.FC<AlertPropTypes> = ({
  colors,
  text,
  Icon,
  timeout,
  onClose,
  open,
}) => {
  useEffect(() => {
    const timeoutId = setTimeout(onClose, timeout || 5000);
    return () => {
      if (typeof timeoutId === "number") clearTimeout(timeoutId);
    };
  });

  return createPortal(
    <StyledAlert
      colors={{ bgColor: colors.bgColor, textColor: colors.textColor }}
      open={open}
    >
      <AlertInfo>
        <Icon />
        <span>{text}</span>
      </AlertInfo>
      <span onClick={onClose} className={"alert-close-btn"}>
        <MdClose />
      </span>
    </StyledAlert>,
    portalRoot
  );
};
