import React, { useState } from "react";
import styled from "styled-components";
import { appColors } from "../../../app/helpers";
import { StyledInput } from "../style";

const Wrapper = styled.div`
  position: relative;
`;

const StyledLabel = styled.label<{ isFocused: boolean }>`
  cursor: auto;
  font-size: ${({ isFocused }) => (isFocused ? "12px" : "16px")};
  color: ${({ isFocused }) => (isFocused ? appColors.primary : "#7c7c7c")};
  font-weight: ${({ isFocused }) => (isFocused ? 500 : 400)};
  background-color: ${({ isFocused }) => (isFocused ? "#fff" : "transparent")};
  padding: 0 5px;
  position: absolute;
  left: 5px;
  top: ${({ isFocused }) => (isFocused ? "-8px" : "7px")};
  transition: 0.1s;
`;

type InputWithLabelProps = {
  id: string;
  value: string;
  label: string;
  name: string;
  type: "text" | "number" | "email";
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(
    props.value.length ? true : false
  );

  return (
    <Wrapper>
      <StyledLabel htmlFor={props.id} isFocused={isFocused}>
        {label}
      </StyledLabel>
      <StyledInput
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => !props.value.length && setIsFocused(false)}
      />
    </Wrapper>
  );
};
