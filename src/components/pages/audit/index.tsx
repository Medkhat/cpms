import { useEffect, useMemo, useState } from "react";
import { Column } from "react-table";
import styled from "styled-components";
import { appColors } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  AuditContent,
  getAudit,
  getAuditDetails,
} from "../../../app/reducers/audit";
import { RootState } from "../../../app/store";
import { FetchingTypes } from "../../../app/types";
import { Modal } from "../../common/modal";
import Table from "../../content/table";

const StyledAuditActions = styled.div`
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const StyledTabs = styled.div`
  display: flex;
  display: -webkit-flex;
  align-items: center;
  gap: 20px;
`;
const StyledTab = styled.p`
  padding: 10px 25px;
  margin: 0;
  font-size: 17px;
  cursor: pointer;
  border-radius: 5px;
  &.active {
    background-color: ${appColors.green};
    color: ${appColors.white};
    box-shadow: 0 7px 10px 0 rgba(0, 0, 0, 0.2);
  }
  :hover {
    color: ${appColors.primary};
  }
`;

interface AuditTableData {
  id: string;
  date: string;
  operation_type: string;
  partner_name: string;
  code: string;
  user: string;
}
const tableColumns: Array<Column<AuditTableData>> = [
  {
    Header: "Партнер",
    accessor: "partner_name",
  },
  {
    Header: "Код",
    accessor: "code",
  },
  {
    Header: "Пользователь",
    accessor: "user",
  },
  {
    Header: "Тип операции",
    accessor: "operation_type",
  },
  {
    Header: "Дата",
    accessor: "date",
  },
];

export const ChangesAudit: React.FC = () => {
  const dispatch = useAppDispatch();
  const [tableTab, setTableTab] = useState<"partners" | "products">("partners");

  const auditList: Array<AuditContent> = useAppSelector(
    (state: RootState) => state.audit.data.content
  );
  const auditDetails = useAppSelector(
    (state: RootState) => state.audit.auditDetails
  );
  const totalPages: number = useAppSelector(
    (state: RootState) => state.audit.data.total_pages
  );
  const pageNumber: number = useAppSelector(
    (state: RootState) => state.audit.data.number
  );
  const fetching: FetchingTypes = useAppSelector(
    (state: RootState) => state.audit.fetching
  );

  const columns = useMemo<Column<AuditTableData>[]>(() => tableColumns, []);
  let data: AuditTableData[] = useMemo(
    (): AuditTableData[] =>
      auditList.map((item) => ({
        ...item,
        operation_type: item.operation_type.title,
      })),
    [auditList]
  );

  const [query, setQuery] = useState<string>("");
  const [detailModalState, setDetailModalState] = useState<boolean>(false);
  // Filter by search query
  if (query.length > 0)
    data = data.filter((item) =>
      item.partner_name.toLowerCase().includes(query.toLowerCase())
    );

  useEffect(() => {
    dispatch(getAudit({ auditType: "partners", page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickPartnersTab = () => {
    setTableTab("partners");
    dispatch(getAudit({ auditType: "partners", page: 1 }));
  };
  const handleClickProductsTab = () => {
    setTableTab("products");
    dispatch(getAudit({ auditType: "products", page: 1 }));
  };
  const handleClickNext = () =>
    dispatch(getAudit({ auditType: tableTab, page: pageNumber + 1 }));
  const handleClickPrev = () =>
    dispatch(getAudit({ auditType: tableTab, page: pageNumber - 1 }));

  const handleClickAudit = (id: string) => {
    setDetailModalState(true);
    dispatch(getAuditDetails({ id, auditType: tableTab }));
  };

  const handleCloseDetailsModal = () => {
    setDetailModalState(false);
  };

  const handleKeyDown = (key: string, page: number) => {
    if (key === "Enter") dispatch(getAudit({ auditType: tableTab, page }));
  };

  return (
    <>
      <StyledAuditActions>
        <StyledTabs>
          <StyledTab
            className={tableTab === "partners" ? "active" : ""}
            onClick={handleClickPartnersTab}
          >
            Партнеры
          </StyledTab>
          <StyledTab
            className={tableTab === "products" ? "active" : ""}
            onClick={handleClickProductsTab}
          >
            Продукты
          </StyledTab>
        </StyledTabs>
      </StyledAuditActions>
      <Table<AuditTableData>
        data={data}
        columns={columns}
        totalPages={totalPages}
        pageNumber={pageNumber}
        handleClickNext={handleClickNext}
        handleClickPrev={handleClickPrev}
        fetching={fetching}
        handleClickRow={handleClickAudit}
        handleKeyDown={handleKeyDown}
        query={query}
        setQuery={setQuery}
      />
      <Modal
        open={detailModalState}
        onClose={handleCloseDetailsModal}
        title={"Данные аудита"}
      >
        <p>
          <b>Дата: </b>{" "}
          {auditDetails?.date.substring(0, 10).split("-").reverse().join("-")}{" "}
          {auditDetails?.date.substring(11, 19)}
        </p>
        <p>
          <b>{tableTab === "partners" ? "Код партнера: " : "Код продукта: "}</b>
          {auditDetails?.partner_code || auditDetails?.product_code}
        </p>
        <p>
          <b>Партнер: </b>
          {auditDetails?.partner_name}
        </p>
        <p>
          <b>Пользователь: </b>
          {auditDetails?.user}
        </p>
        <p>
          <b>Тип операции: </b>
          {auditDetails?.operation_type_code}
        </p>
        <div>
          <b>Изменений до: </b>
          <pre>{JSON.stringify(auditDetails?.before_changes, null, 2)}</pre>
        </div>
        <div>
          <b>Изменений после: </b>
          <pre>{JSON.stringify(auditDetails?.after_changes, null, 2)}</pre>
        </div>
      </Modal>
    </>
  );
};
