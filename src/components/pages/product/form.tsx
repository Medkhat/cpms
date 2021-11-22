/* eslint-disable no-lone-blocks */
import ReactSwitch from "react-switch";
import Select from "react-select";
import { FetchingTypes, ReactSelectValues } from "../../../app/types";
import { FormGroup, StyledErrorMessage } from "../../common/style";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "../../common/button";
import {
  appColors,
  customStyles,
  customTheme,
  loanTerms,
  loanType,
} from "../../../app/helpers";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { postProducts } from "../../../app/reducers/products";
import { RootState } from "../../../app/store";
import { AiOutlineEdit } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { InputWithLabel } from "../../common/input";
import { CustomValueContainer } from "../../common/rscc";

type ProductFormPropTypes = {
  onClose: () => void;
  isSingleProduct: boolean;
  singleProduct: FormDataTypes;
};

export type FormDataTypes = {
  id?: string;
  partner_id: string;
  type: string;
  state: string;
  code: string;
  name: string;
  max_amount: string;
  min_amount: string;
  months: number;
  rate: string;
  for_calculator: boolean;
  sku_list: string;
  city_list: string;
};

const LoanTermsWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  gap: 10px;
  .term-item {
    padding: 5px 10px;
    border-radius: 10px;
    background-color: ${appColors.lightGray};
    cursor: pointer;
  }
  .term-item:hover {
    background-color: ${appColors.darkGray};
  }
  .term-item.selected {
    background-color: ${appColors.skyBlue};
    color: ${appColors.white};
  }
`;

// Yup validation schema for product form
const validationSchema = Yup.object().shape({
  partner_id: Yup.string().required("Обязательное поле"),
  type: Yup.string().required("Обязательное поле"),
  code: Yup.string().required("Обязательное поле"),
  name: Yup.string().required("Обязательное поле"),
  max_amount: Yup.number()
    .typeError("Только цифры")
    .required("Обязательное поле"),
  min_amount: Yup.number()
    .typeError("Только цифры")
    .required("Обязательное поле"),
  rate: Yup.number().typeError("Только цифры").required("Обязательное поле"),
});

export const separator: RegExp = /\s*,\s*/;
export const ProductForm: React.FC<ProductFormPropTypes> = ({
  onClose,
  isSingleProduct,
  singleProduct,
}) => {
  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState<boolean>(
    isSingleProduct ? false : true
  );

  const handleChangeNumberInputs = (
    value: string,
    inputType: "max" | "min" | "rate"
  ) => {
    switch (inputType) {
      case "max":
        formik.setFieldValue("max_amount", value);
        break;
      case "min":
        formik.setFieldValue("min_amount", value);
        break;
      case "rate":
        formik.setFieldValue("rate", value);
        break;
      default:
        break;
    }
  };

  const createIsFetching: FetchingTypes = useAppSelector(
    (state: RootState) => state.products.createIsFetcing
  );
  const partners: Array<ReactSelectValues> = useAppSelector(
    (state: RootState) => state.products.partners
  );
  const pageNumber: number = useAppSelector(
    (state) => state.products.data.number
  );

  const formik = useFormik({
    initialValues: isSingleProduct
      ? { ...singleProduct }
      : {
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
          city_list: "",
          sku_list: "",
        },
    validationSchema,
    onSubmit: (values) =>
      dispatch(
        postProducts(
          isSingleProduct
            ? {
                postData: {
                  method: "put",
                  id: singleProduct.id,
                  pageNumber,
                  ...values,
                  rate: parseFloat(values.rate),
                  min_amount: parseInt(values.min_amount),
                  max_amount: parseInt(values.max_amount),
                  sku_list: values.sku_list.length
                    ? values.sku_list.split(separator)
                    : [],
                  city_list: values.city_list.length
                    ? values.city_list.split(separator)
                    : [],
                },
                modalCloser: onClose,
              }
            : {
                postData: {
                  method: "post",
                  pageNumber,
                  ...values,
                  rate: parseFloat(values.rate),
                  min_amount: parseInt(values.min_amount),
                  max_amount: parseInt(values.max_amount),
                  sku_list: values.sku_list.length
                    ? values.sku_list.split(separator)
                    : [],
                  city_list: values.city_list.length
                    ? values.city_list.split(separator)
                    : [],
                },
                modalCloser: onClose,
              }
        )
      ),
  });

  const handleClickTerms = (value: number) =>
    formik.setFieldValue("months", value);

  return (
    <>
      {isSingleProduct && (
        <FormGroup>
          <Button
            type={"button"}
            colors={
              editMode
                ? {
                    bgColor: appColors.lightGray,
                    textColor: appColors.black,
                  }
                : {
                    bgColor: appColors.primary,
                    textColor: appColors.white,
                  }
            }
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? <ImCancelCircle /> : <AiOutlineEdit />}
            <span className={"btn-text"}>
              {editMode ? "Отменить редактирование" : "Редактировать"}
            </span>
          </Button>
        </FormGroup>
      )}
      <form onSubmit={formik.handleSubmit}>
        <FormGroup>
          <Select
            options={partners}
            placeholder={"Партнер"}
            theme={customTheme}
            styles={customStyles("form")}
            components={{
              ValueContainer: CustomValueContainer,
            }}
            menuPosition={"fixed"}
            onChange={(valueItem) =>
              formik.setFieldValue("partner_id", valueItem?.value)
            }
            onBlur={() => formik.setFieldTouched("partner_id", true)}
            value={
              partners.filter(
                (item) => item.value === formik.values.partner_id
              )[0]
            }
            isDisabled={!editMode}
          />
          {formik.touched && formik.errors.partner_id && (
            <StyledErrorMessage>{formik.errors.partner_id}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <InputWithLabel
            id={"code"}
            name={"code"}
            type={"text"}
            label={"Код продукта"}
            value={formik.values.code}
            onChange={(e) => formik.setFieldValue("code", e.target.value)}
            disabled={!editMode}
          />
          {formik.touched && formik.errors.code && (
            <StyledErrorMessage>{formik.errors.code}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <InputWithLabel
            id={"name"}
            name={"name"}
            type={"text"}
            label={"Название продукта"}
            value={formik.values.name}
            onChange={(e) => formik.setFieldValue("name", e.target.value)}
            disabled={!editMode}
          />
          {formik.touched && formik.errors.name && (
            <StyledErrorMessage>{formik.errors.name}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <Select
            options={loanType}
            placeholder={"Тип"}
            theme={customTheme}
            styles={customStyles("form")}
            menuPosition={"fixed"}
            isSearchable={false}
            components={{
              ValueContainer: CustomValueContainer,
            }}
            onChange={(valueItem) =>
              formik.setFieldValue("type", valueItem?.value)
            }
            onBlur={() => formik.setFieldTouched("type", true)}
            value={loanType.filter((item) => item.value === formik.values.type)}
            isDisabled={!editMode}
          />
          {formik.touched && formik.errors.type && (
            <StyledErrorMessage>{formik.errors.type}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <InputWithLabel
            id={"rate"}
            name={"rate"}
            type={"number"}
            label={"Рейтинг"}
            value={formik.values.rate}
            onChange={(e) => handleChangeNumberInputs(e.target.value, "rate")}
            disabled={!editMode}
          />
          {formik.touched && formik.errors.rate && (
            <StyledErrorMessage>{formik.errors.rate}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup dsp={"flex"} alignItems={"flex-start"}>
          <div>
            <InputWithLabel
              id={"min_amount"}
              name={"min_amount"}
              type={"number"}
              label={"Мин. сумма, тг"}
              value={formik.values.min_amount}
              onChange={(e) => handleChangeNumberInputs(e.target.value, "min")}
              disabled={!editMode}
            />
            {formik.touched && formik.errors.min_amount && (
              <StyledErrorMessage>
                {formik.errors.min_amount}
              </StyledErrorMessage>
            )}
          </div>
          <div>
            <InputWithLabel
              id={"max_amount"}
              name={"max_amount"}
              type={"number"}
              label={"Макс. сумма, тг"}
              value={formik.values.max_amount}
              onChange={(e) => handleChangeNumberInputs(e.target.value, "max")}
              disabled={!editMode}
            />
            {formik.touched && formik.errors.max_amount && (
              <StyledErrorMessage>
                {formik.errors.max_amount}
              </StyledErrorMessage>
            )}
          </div>
        </FormGroup>
        <FormGroup>
          <InputWithLabel
            id={"sku_list"}
            name={"sku_list"}
            type={"text"}
            label={"Список SKU кодов"}
            value={formik.values.sku_list}
            onChange={(e) =>
              formik.setFieldValue("sku_list", e.target.value.trim())
            }
            disabled={!editMode}
          />
          {formik.touched && formik.errors.sku_list && (
            <StyledErrorMessage>{formik.errors.sku_list}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup>
          <InputWithLabel
            id={"city_list"}
            name={"city_list"}
            type={"text"}
            label={"Список кодов региона"}
            value={formik.values.city_list}
            onChange={(e) =>
              formik.setFieldValue("city_list", e.target.value.trim())
            }
            disabled={!editMode}
          />
          {formik.touched && formik.errors.city_list && (
            <StyledErrorMessage>{formik.errors.city_list}</StyledErrorMessage>
          )}
        </FormGroup>
        <FormGroup dsp={"flex"}>
          <span>Статус активности</span>
          <ReactSwitch
            checked={formik.values.state === "active"}
            onChange={() =>
              formik.setFieldValue(
                "state",
                formik.values.state === "active" ? "inactive" : "active"
              )
            }
            checkedIcon={false}
            uncheckedIcon={false}
            disabled={!editMode}
          />
        </FormGroup>
        <FormGroup dsp={"flex"}>
          <span>Для калькулятора</span>
          <ReactSwitch
            checked={formik.values.for_calculator}
            onChange={() =>
              formik.setFieldValue(
                "for_calculator",
                !formik.values.for_calculator
              )
            }
            checkedIcon={false}
            uncheckedIcon={false}
            disabled={!editMode}
          />
        </FormGroup>
        <FormGroup>
          <h4>На какой срок можно одобрять: </h4>
          <LoanTermsWrapper>
            {loanTerms.map((item) => (
              <span
                key={item.value}
                className={`term-item ${
                  item.value === formik.values.months && "selected"
                }`}
                onClick={() =>
                  handleClickTerms(
                    typeof item.value === "number" ? item.value : 3
                  )
                }
              >
                {item.label}
              </span>
            ))}
          </LoanTermsWrapper>
        </FormGroup>
        <FormGroup dsp={"flex"} className={"form-btns"}>
          <Button
            colors={{
              bgColor: appColors.lightGray,
              textColor: appColors.black,
            }}
            onClick={onClose}
          >
            <span className={"btn-text"}>Отмена</span>
          </Button>
          <Button
            colors={{
              bgColor: appColors.primary,
              textColor: appColors.white,
            }}
            type={"submit"}
            disabled={isSingleProduct && !editMode}
          >
            <span className={"btn-text"}>
              {createIsFetching === "pending"
                ? "Подождите..."
                : isSingleProduct
                ? "Сохранить"
                : "Добавить"}
            </span>
          </Button>
        </FormGroup>
      </form>
    </>
  );
};
