import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";
import { portalRoot } from "../../..";
import { appColors } from "../../../app/helpers";

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.322);
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
`;
const ModalWrapper = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  overflow: hidden;
  max-height: calc(100vh - 20%);
  min-width: 300px;
  max-width: 470px;
`;

const ModalHeader = styled.div`
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;

  h3 {
    margin: 0;
    font-weight: 500;
    font-size: 24px;
  }
  span {
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: ${appColors.primary};
    font-size: 25px;
    transform: rotate(0deg);
    transition: transform 0.3s;
  }
  span:hover {
    transform: rotate(360deg);
    transition: transform 0.3s;
  }
`;

export const ModalContent = styled.div`
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 20px 10px 0 10px;
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(24, 24, 24, 0.3);
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${appColors.primary};
  }
`;

type ModalPropTypes = {
  title: string;
  open: boolean;
  onClose?: () => void;
};
export const Modal: React.FC<ModalPropTypes> = ({
  open,
  title,
  onClose,
  children,
}) => {
  if (!open) return null;
  return createPortal(
    <StyledModal>
      <ModalWrapper>
        <ModalHeader>
          <h3>{title}</h3>
          {onClose && (
            <span onClick={onClose}>
              <IoMdClose />
            </span>
          )}
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </ModalWrapper>
    </StyledModal>,
    portalRoot
  );
};
