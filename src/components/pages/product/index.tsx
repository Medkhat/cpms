import { useEffect, useMemo, useState } from "react";
import { Column } from "react-table";
import { appColors, modifyNumbers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  ContentTypes,
  FilterParams,
  getProducts,
  getProductsByFilter,
  setFetchingTypes,
  setFilterParams,
  setIsTokenExp,
  setSuccessAlertState,
} from "../../../app/reducers/products";
import { RootState } from "../../../app/store";
import { FetchingTypes } from "../../../app/types";
import { Modal } from "../../common/modal";
import { ContentActions } from "../../content/actions";
import Table from "../../content/table";
import { ProductFilters } from "./filter";
import { FormDataTypes, ProductForm } from "./form";
import { ExpiredTokenMessage } from "../../common/expiredTokenMessage";
import { Alert } from "../../common/alert";
import { BsCheckCircle } from "react-icons/bs";

interface ProductTableData {
  id: string;
  partner_id: string;
  partner_name: string;
  type: string;
  type_title: string;
  state: string;
  state_title: JSX.Element;
  code: string;
  name: string;
  min_max_amount: string;
  months: JSX.Element;
  rate: string;
  for_calculator: JSX.Element;
  isSorted?: any;
  isSortedDesc?: any;
}

const tableColumns: Array<Column<ProductTableData>> = [
  {
    Header: "Партнер",
    accessor: "partner_name",
  },
  {
    Header: "Код",
    accessor: "code",
  },
  {
    Header: "Тип",
    accessor: "type_title",
  },
  {
    Header: "Имя",
    accessor: "name",
  },
  {
    Header: "Срок",
    accessor: "months",
  },
  {
    Header: "Лимиты(мин. - макс.)",
    accessor: "min_max_amount",
  },
  {
    Header: "Рейтинг",
    accessor: "rate",
  },
  {
    Header: "Статус",
    accessor: "state_title",
  },
  {
    Header: "Калькулятор",
    accessor: "for_calculator",
  },
];

export const Products: React.FC = () => {
  const productsList: Array<ContentTypes> = useAppSelector(
    (state: RootState) => state.products.data.content
  );
  const isTokenExp: boolean = useAppSelector(
    (state: RootState) => state.products.isTokenExp
  );
  const totalPages: number = useAppSelector(
    (state: RootState) => state.products.data.total_pages
  );
  const pageNumber: number = useAppSelector(
    (state: RootState) => state.products.data.number
  );
  const fetching: FetchingTypes = useAppSelector(
    (state: RootState) => state.products.fetching
  );
  const successAlertState: boolean = useAppSelector(
    (state: RootState) => state.products.successAlertState
  );
  const alertMessage: string = useAppSelector(
    (state: RootState) => state.products.message
  );
  let params: FilterParams = useAppSelector(
    (state) => state.products.filterParams
  );

  let data: ProductTableData[] = useMemo(
    (): ProductTableData[] =>
      productsList.map((item) => {
        return {
          ...item,
          min_max_amount: `${modifyNumbers(item.min_amount)} - ${modifyNumbers(
            item.max_amount
          )} тг`,
          months: <span className={"months"}>{item.months} мес.</span>,
          state_title: (
            <span className={item.state === "active" ? "active" : "inactive"}>
              {item.state_title}
            </span>
          ),
          for_calculator: (
            <span className={item.for_calculator ? "active" : "inactive"}>
              {item.for_calculator ? "Да" : "Нет"}
            </span>
          ),
          rate: item.rate.toString().substring(0, 4),
        };
      }),
    [productsList]
  );
  const dispatch = useAppDispatch();
  const columns = useMemo<Column<ProductTableData>[]>(() => tableColumns, []);

  // Open/Close state
  const [isOpenProductForm, setIsOpenProductForm] = useState<boolean>(false);
  const [isOpenFilters, setIsOpenFilters] = useState<boolean>(false);
  const [isSingleProduct, setIsSingleProduct] = useState<boolean>(false);
  let [singleProduct, setSingleProduct] = useState<FormDataTypes>({
    id: "",
    partner_id: "",
    type: "",
    state: "inactive",
    code: "",
    name: "",
    max_amount: "",
    min_amount: "",
    months: 3,
    rate: "",
    for_calculator: false,
    sku_list: "",
    city_list: "",
  });

  const [query, setQuery] = useState<string>("");

  // Filter by search query
  if (query.length > 0)
    data = data.filter((item) =>
      item.partner_name.toLowerCase().includes(query.toLowerCase())
    );

  useEffect(() => {
    dispatch(getProducts(1));
    if (params.state) {
      dispatch(
        setFilterParams({
          partner_code: "",
          product_type: "",
          product_code: "",
          months: 0,
          state: false,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Open/Close handlers
  const handleClickAdd = () => setIsOpenProductForm(true);
  const handleClickFilter = () => {
    fetching !== "idle" && dispatch(setFetchingTypes("idle"));
    setIsOpenFilters(true);
  };
  const handleCloseProductForm = () => {
    setIsOpenProductForm(false);
    if (isSingleProduct) setIsSingleProduct(false);
  };
  const handleCloseFilters = () => {
    setIsOpenFilters(false);

    fetching !== "idle" && dispatch(setFetchingTypes("idle"));
  };

  const handleClickNext = () =>
    params.state
      ? dispatch(getProductsByFilter({ page: pageNumber + 1, params }))
      : dispatch(getProducts(pageNumber + 1));

  const handleClickPrev = () =>
    params.state
      ? dispatch(getProductsByFilter({ page: pageNumber - 1, params }))
      : dispatch(getProducts(pageNumber - 1));

  const handleClickRow = (id: string) => {
    let productData: ContentTypes = productsList.filter(
      (item) => item.id === id
    )[0];
    setIsOpenProductForm(true);
    setIsSingleProduct(true);
    setSingleProduct({
      id: productData.id,
      partner_id: productData.partner_id,
      name: productData.name,
      code: productData.code,
      max_amount: productData.max_amount.toString(),
      min_amount: productData.min_amount.toString(),
      for_calculator: productData.for_calculator,
      months: productData.months,
      rate: productData.rate.toString(),
      state: productData.state,
      type: productData.type,
      sku_list: productData.sku_list ? productData.sku_list.join(",") : "",
      city_list: productData.city_list ? productData.city_list.join(",") : "",
    });
  };
  const handleKeyDown = (key: string, page: number) => {
    if (key === "Enter") dispatch(getProducts(page));
  };
  const handleClickResetFilter = () => {
    if (params.state) {
      dispatch(getProducts(1));
      dispatch(
        setFilterParams({
          partner_code: "",
          product_type: "",
          product_code: "",
          months: 0,
          state: false,
        })
      );
    }
  };

  return (
    <>
      <ContentActions
        contentType={"products"}
        addText={"Добавить продукт"}
        handleClickAdd={handleClickAdd}
        handleClickFilter={handleClickFilter}
        handleClickResetFilter={handleClickResetFilter}
      />
      <Table<ProductTableData>
        data={data}
        columns={columns}
        totalPages={totalPages}
        pageNumber={pageNumber}
        handleClickNext={handleClickNext}
        handleClickPrev={handleClickPrev}
        fetching={fetching}
        handleClickRow={handleClickRow}
        handleKeyDown={handleKeyDown}
        query={query}
        setQuery={setQuery}
      />
      <Modal
        open={isOpenProductForm}
        onClose={handleCloseProductForm}
        title={!isSingleProduct ? "Добавление продукта" : "Изменение продукта"}
      >
        <ProductForm
          onClose={handleCloseProductForm}
          isSingleProduct={isSingleProduct}
          singleProduct={singleProduct}
        />
      </Modal>
      <Modal open={isOpenFilters} onClose={handleCloseFilters} title={"Фильтр"}>
        <ProductFilters onClose={handleCloseFilters} />
      </Modal>
      <Modal open={isTokenExp} title={"Сообщение"}>
        <ExpiredTokenMessage setIsTokenExp={setIsTokenExp} />
      </Modal>
      {successAlertState && (
        <Alert
          Icon={() => <BsCheckCircle />}
          text={alertMessage}
          open={successAlertState}
          onClose={() => {
            dispatch(setSuccessAlertState(false));
          }}
          colors={{ bgColor: appColors.green, textColor: appColors.white }}
          timeout={4000}
        />
      )}
    </>
  );
};
