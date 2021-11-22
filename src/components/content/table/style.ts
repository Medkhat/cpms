import styled from "styled-components";
import { appColors } from "../../../app/helpers";

export const TableWrapper = styled.div`
  overflow-x: auto;
`;
export const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 1520px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  background-color: ${appColors.white};
  thead {
    width: calc(100% - 1rem);
  }
  tbody {
    width: 100%;
    display: block;
    max-height: calc(100vh - 276px);
    overflow-y: auto;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
    cursor: pointer;
    :hover {
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
      transition: box-shadow 0.2s;
    }
  }
  th {
    background-color: ${appColors.darkGray};
  }
  th,
  td {
    padding: 10px;
  }
  span {
    padding: 1px 5px;
    border-radius: 5px;
    color: ${appColors.white};
  }
  span.active {
    background-color: ${appColors.green};
  }
  span.inactive {
    background-color: ${appColors.error};
  }
  span.months {
    background-color: ${appColors.primary};
  }
`;
export const StyledTableActions = styled.div`
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
export const SearchInputWrapper = styled.div`
  position: relative;
  width: 300px;
  .search-input__icon {
    font-size: 26px;
    position: absolute;
    top: 6px;
    right: 10px;
    color: ${appColors.primary};
  }
`;
export const StyledPagination = styled.div`
  display: flex;
  display: -webkit-flex;
  align-items: center;
  gap: 10px;
  .pagination-text {
    width: 70px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
  }
  .pagination-arrow {
    font-size: 30px;
    color: ${appColors.primary};
    cursor: pointer;
    border: none;
    background: none;
  }
  .pagination-arrow.disabled {
    color: ${appColors.darkGray};
  }
`;
export const PaginationWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  align-items: center;
  gap: 10px;
`;
