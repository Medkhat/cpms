import React, { PropsWithChildren, useState } from "react";
import {
  AiFillCaretDown,
  AiFillCaretUp,
} from "react-icons/ai";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { Column, useSortBy, useTable } from "react-table";
import { appColors } from "../../../app/helpers";
import { FetchingTypes } from "../../../app/types";
import { StyledIcon, StyledInput } from "../../common/style";
import {
  PaginationWrapper,
  StyledPagination,
  StyledTable,
  StyledTableActions,
  TableWrapper,
} from "./style";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface TablePropTypes<TableDataTypes extends object> {
  data: TableDataTypes[];
  columns: Column<TableDataTypes>[];
  totalPages: number;
  pageNumber: number;
  handleClickNext: () => void;
  handleClickPrev: () => void;
  handleClickRow: (id: string) => void;
  handleKeyDown: (key: string, page: number) => void;
  fetching?: FetchingTypes;
  query: string;
  setQuery: (q: string) => void;
}

function Table<TableDataTypes extends { id: string }>({
  data,
  columns,
  totalPages,
  pageNumber,
  handleClickNext,
  handleClickPrev,
  handleClickRow,
  fetching,
  query,
  setQuery,
  handleKeyDown,
}: PropsWithChildren<TablePropTypes<TableDataTypes>>) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  const [pageNumberFromInput, setPageNumberFromInput] = useState<string>("");

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setQuery(e.target.value);

  const handleChangePageNumber = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPageNumberFromInput(e.target.value);

  return (
    <React.Fragment>
      <StyledTableActions>
        {/* <SearchInputWrapper>
          <StyledInput
            name={"search"}
            placeholder={"Введите название"}
            type={"text"}
            value={query}
            onChange={handleChange}
          />
          <StyledIcon className={"search-input__icon"}>
            <AiOutlineSearch />
          </StyledIcon>
        </SearchInputWrapper> */}
        <PaginationWrapper>
          <StyledPagination>
            <button
              className={`pagination-arrow ${
                (fetching === "pending" || pageNumber === 1) && "disabled"
              }`}
              type={"button"}
              onClick={handleClickPrev}
              disabled={fetching === "pending" || pageNumber === 1}
            >
              <StyledIcon>
                <IoIosArrowDropleftCircle />
              </StyledIcon>
            </button>
            <span className={"pagination-text"}>
              {pageNumber} of {totalPages}
            </span>
            <button
              className={`pagination-arrow ${
                (fetching === "pending" || pageNumber === totalPages) &&
                "disabled"
              }`}
              type={"button"}
              onClick={handleClickNext}
              disabled={fetching === "pending" || pageNumber === totalPages}
            >
              <StyledIcon>
                <IoIosArrowDroprightCircle />
              </StyledIcon>
            </button>
          </StyledPagination>

          <StyledInput
            name={"pageNumber"}
            placeholder={"Номер страницы"}
            value={pageNumberFromInput}
            onChange={handleChangePageNumber}
            onKeyDown={(e: React.KeyboardEvent) =>
              handleKeyDown(e.key, parseInt(pageNumberFromInput))
            }
            type={"number"}
          />
        </PaginationWrapper>
      </StyledTableActions>
      <SkeletonTheme
        color={appColors.gray}
        highlightColor={appColors.lightGray}
      >
        <TableWrapper>
          <StyledTable {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      // @ts-ignore
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {
                          // @ts-ignore
                          column.isSorted ? (
                            // @ts-ignore
                            column.isSortedDesc ? (
                              <AiFillCaretDown />
                            ) : (
                              <AiFillCaretUp />
                            )
                          ) : (
                            ""
                          )
                        }
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {fetching === "pending"
                ? [1, 2, 3, 4, 5, 6].map((item) => (
                    <tr key={item}>
                      <td>
                        <Skeleton
                          width={"98%"}
                          height={20}
                          style={{ margin: "5px 0" }}
                        />
                      </td>
                    </tr>
                  ))
                : rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        onClick={() => handleClickRow(row.original.id)}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </SkeletonTheme>
    </React.Fragment>
  );
}

export default Table;
