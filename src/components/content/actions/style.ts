import styled from "styled-components";

export const StyledContentActions = styled.div`
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
export const FiltersActions = styled.div`
  display: flex;
  display: -webkit-flex;
  align-items: center;
  gap: 20px;
`;
export const SelectWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  align-items: center;
  .select-text {
    margin-right: 10px;
    font-weight: 500;
  }
  & > div {
    width: 140px;
  }
`;
