import styled from "styled-components";

type ButtonColorsTypes = {
  bgColor: string;
  textColor: string;
};
type ButtonPropTypes = {
  colors: ButtonColorsTypes; // Button bg and text color
  onClick?: () => void;
  className?: string;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
};

const StyledButton = styled.button<{
  colors: ButtonColorsTypes;
  disabled?: boolean;
}>`
  border: none;
  border-radius: 5px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  gap: 10px;
  background-color: ${({ colors }) => colors.bgColor};
  color: ${({ colors }) => colors.textColor};
  padding: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
  text-transform: uppercase;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  :hover {
    opacity: ${({ disabled }) => (disabled ? 0.5 : 0.8)};
    transition: opacity 0.2s;
    cursor: ${({ disabled }) => (disabled ? "no-drop" : "pointer")};
  }
`;

export const Button: React.FC<ButtonPropTypes> = ({
  children,
  onClick,
  colors,
  type,
  className,
  disabled,
}) => {
  return (
    <StyledButton
      className={className || ""}
      type={type || "button"}
      onClick={onClick}
      colors={colors}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};
