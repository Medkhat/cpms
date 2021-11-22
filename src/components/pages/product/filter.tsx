import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import {
  appColors,
  customStyles,
  customTheme,
  loanTerms,
  loanType,
} from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  FilterParams,
  getProductCodes,
  getProductsByFilter,
  setFilterParams,
} from "../../../app/reducers/products";
import { RootState } from "../../../app/store";
import { FetchingTypes, ReactSelectValues } from "../../../app/types";
import { Button } from "../../common/button";
import { FormGroup, StyledErrorMessage } from "../../common/style";

type ProductFiltersPropTypes = {
  onClose: () => void;
};

export const ProductFilters: React.FC<ProductFiltersPropTypes> = ({
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const fetching: FetchingTypes = useAppSelector(
    (state: RootState) => state.products.fetching
  );
  const partnersCodes: Array<ReactSelectValues> = useAppSelector(
    (state: RootState) => state.products.partnersCodes
  );
  const productCodes: Array<ReactSelectValues> = useAppSelector(
    (state: RootState) => state.products.productCodes
  );
  let params: FilterParams = useAppSelector(
    (state) => state.products.filterParams
  );
  const [isPartnerSelected, setIsPartnerSelected] = useState<boolean>(
    params.partner_code ? true : false
  );

  const handleChange = (
    value: string | number | undefined,
    paramType: "partner" | "productCode" | "productType" | "term"
  ) => {
    switch (paramType) {
      case "partner":
        typeof value === "string" && dispatch(getProductCodes(value));
        setIsPartnerSelected(true);
        dispatch(
          setFilterParams({
            ...params,
            partner_code: typeof value === "string" ? value : "",
            state: true,
          })
        );
        break;
      case "productCode":
        dispatch(
          setFilterParams({
            ...params,
            product_code: typeof value === "string" ? value : "",
            state: true,
          })
        );
        break;
      case "productType":
        dispatch(
          setFilterParams({
            ...params,
            product_type: typeof value === "string" ? value : "",
            state: true,
          })
        );
        break;
      case "term":
        dispatch(
          setFilterParams({
            ...params,
            months: typeof value === "number" ? value : 0,
            state: true,
          })
        );
        break;
      default:
        break;
    }
  };

  const handleClick = () => dispatch(getProductsByFilter({ params, page: 1 }));

  useEffect(() => {
    if (fetching === "success") onClose();
  }, [fetching, onClose]);

  const filterHelper = useCallback(
    (
      arr: Array<ReactSelectValues>,
      filterBy: string | number | undefined
    ): ReactSelectValues => arr.filter((item) => item.value === filterBy)[0],
    []
  );

  return (
    <>
      <FormGroup>
        <Select
          options={partnersCodes}
          value={filterHelper(partnersCodes, params.partner_code)}
          placeholder={"Партнер"}
          theme={customTheme}
          styles={customStyles("form")}
          menuPosition={"fixed"}
          onChange={(item) => handleChange(item?.value, "partner")}
        />
      </FormGroup>
      <FormGroup>
        <Select
          options={productCodes}
          value={filterHelper(productCodes, params.product_code)}
          placeholder={"Код продукта"}
          theme={customTheme}
          styles={customStyles("form")}
          menuPosition={"fixed"}
          isDisabled={!isPartnerSelected}
          isClearable={true}
          onChange={(item) => handleChange(item?.value, "productCode")}
        />
        {!isPartnerSelected && (
          <StyledErrorMessage style={{ display: "inline" }}>
            Код продукта будет доступен после выбора партнера
          </StyledErrorMessage>
        )}
      </FormGroup>
      <FormGroup>
        <Select
          options={loanType}
          value={filterHelper(loanType, params.product_type)}
          placeholder={"Тип"}
          theme={customTheme}
          styles={customStyles("form")}
          menuPosition={"fixed"}
          isSearchable={false}
          isClearable={true}
          onChange={(item) => handleChange(item?.value, "productType")}
        />
      </FormGroup>
      <FormGroup>
        <Select
          options={loanTerms}
          value={filterHelper(loanTerms, params.months)}
          placeholder={"Срок"}
          theme={customTheme}
          styles={customStyles("form")}
          menuPosition={"fixed"}
          isSearchable={false}
          isClearable={true}
          onChange={(item) => handleChange(item?.value, "term")}
        />
      </FormGroup>
      <FormGroup dsp={"flex"} className={"form-btns"}>
        <Button
          colors={{ bgColor: appColors.lightGray, textColor: appColors.black }}
          onClick={onClose}
        >
          <span className={"btn-text"}>Отмена</span>
        </Button>
        <Button
          colors={{ bgColor: appColors.primary, textColor: appColors.white }}
          onClick={handleClick}
        >
          <span className={"btn-text"}>
            {fetching === "pending" ? "Подождите..." : "Найти"}
          </span>
        </Button>
      </FormGroup>
    </>
  );
};
