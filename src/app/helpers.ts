import { StylesConfig } from "react-select";
import { ThemeConfig } from "react-select/src/theme";
import { ReactSelectValues } from "./types";

// Helpers fot styled components
export const appColors = {
  white: "#fff",
  primary: "#FF681D",
  primaryTransparent: "#ff681d3d",
  primaryDark: "#b64208",
  lightGray: "#e5e5e5",
  darkGray: "rgb(179, 179, 179)",
  black: "#000",
  skyBlue: "#42BBF8",
  green: "#73BE6F",
  error: "red",
  gray: "#d0d0d0",
};

// Custom styles for React Select Library
export const customTheme: ThemeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: appColors.primary,
    primary25: appColors.primaryTransparent,
  },
});

// Custom styles for @react-select
export const customStyles: (
  singleValueType: string
) => StylesConfig<ReactSelectValues, false> = (singleValueType) => {
  return {
    singleValue: (styles, state) => ({
      ...styles,
      color: singleValueType === "action" ? appColors.primary : appColors.black,
    }),
    control: (styles, state) => ({
      ...styles,
      boxShadow: "",
      cursor: "pointer",
      borderWidth: "2px",
      borderColor: appColors.lightGray,
      backgroundColor: appColors.white,
    }),
    option: (styles, state) => ({
      ...styles,
      cursor: "pointer",
    }),
    indicatorSeparator: (styles, state) => ({
      ...styles,
      display: "none",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      position: "absolute",
      top: state.hasValue || state.selectProps.inputValue ? -3 : "50%",
      transition: "top 0.1s, font-size 0.1s",
      fontSize: (state.hasValue || state.selectProps.inputValue) && 12,
      fontWeight: state.hasValue || state.selectProps.inputValue ? 500 : 400,
      color:
        state.hasValue || state.selectProps.inputValue
          ? appColors.primary
          : "#7c7c7c",
      padding: "0 5px",
      backgroundColor: appColors.white,
      left: 5,
    }),
    valueContainer: (styles, state) => ({
      ...styles,
      position: "static",
    }),
  };
};

// axios helpers
export const axiosOptions = (token: string | null) => ({
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${token}`,
    "Access-Control-Allow-Origin": "*",
    mode: "no-cors",
    credentials: "same-origin",
  },
});

// Used to modify number, for example: 1000000 => 1 000 000
export const modifyNumbers = (numbers: number) => {
  let str: Array<string> = numbers.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }

  return str.join(".");
};

// React select values
export const loanType: Array<ReactSelectValues> = [
  { value: "installment", label: "Рассрочка" },
  { value: "loan", label: "Кредит" },
];
export const loanTerms: Array<ReactSelectValues> = [
  { value: 3, label: "3 месяца" },
  { value: 6, label: "6 месяцев" },
  { value: 12, label: "12 месяцев" },
  { value: 18, label: "18 месяцев" },
  { value: 24, label: "24 месяца" },
  { value: 36, label: "36 месяцев" },
  { value: 48, label: "48 месяцев" },
  { value: 60, label: "60 месяцев" },
];

// BASE URL
const hostname = window.location.host;
export const BASE_URL =
  hostname === "cpms.technodom.kz"
    ? process.env.REACT_APP_BASE_URL_PRODUCTION
    : hostname === "tkcld.technodom.kz:32688"
    ? process.env.REACT_APP_BASE_URL
    : "";
