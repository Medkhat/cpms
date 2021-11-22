import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosOptions, BASE_URL } from "../../helpers";
import {
  BaseResponseData,
  ErrorObject,
  FetchingTypes,
  PostResponseData,
  ReactSelectValues,
} from "../../types";

export type ContentTypes = {
  id: string;
  partner_id: string;
  partner_name: string;
  type: string;
  type_title: string;
  state: string;
  state_title: string;
  code: string;
  name: string;
  max_amount: number;
  min_amount: number;
  months: number;
  rate: number;
  for_calculator: boolean;
  sku_list: Array<string>;
  city_list: Array<string>;
};
type PostDataTypes = {
  method: "post" | "put";
  pageNumber: number;
  id?: string;
  partner_id: string;
  type: string;
  state: string;
  code: string;
  name: string;
  max_amount: number;
  min_amount: number;
  months: number;
  rate: number;
  for_calculator: boolean;
  sku_list: Array<string>;
  city_list: Array<string>;
};

// Get all list of products
export const getProducts = createAsyncThunk<
  BaseResponseData<ContentTypes>,
  number,
  { rejectValue: ErrorObject }
>("products/get", async (pageNumber, { rejectWithValue }) => {
  try {
    return await axios
      .get(
        `${BASE_URL}/management/product/page/products?page=${pageNumber}`,
        axiosOptions(localStorage.getItem("token"))
      )
      .then((res) => res.data);
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
  }
});

// Create new products
export const postProducts = createAsyncThunk<
  PostResponseData,
  { postData: PostDataTypes; modalCloser: () => void },
  { rejectValue: ErrorObject }
>(
  "products/post",
  async (
    { postData: { method, pageNumber, ...data }, modalCloser },
    { rejectWithValue, dispatch }
  ) => {
    try {
      return method === "post"
        ? await axios
            .post(
              `${BASE_URL}/management/product`,
              data,
              axiosOptions(localStorage.getItem("token"))
            )
            .then((res) => {
              modalCloser();
              dispatch(getProducts(pageNumber));
              return res.data;
            })
        : await axios
            .put(
              `${BASE_URL}/management/product`,
              data,
              axiosOptions(localStorage.getItem("token"))
            )
            .then((res) => {
              modalCloser();
              dispatch(getProducts(pageNumber));
              return res.data;
            });
    } catch (err) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
    }
  }
);

// Get product codes by selected partner
export const getProductCodes = createAsyncThunk<
  Array<ContentTypes>,
  string,
  { rejectValue: ErrorObject }
>("products/get/codes", async (partnerCode, { rejectWithValue }) => {
  try {
    return await axios
      .get(
        `${BASE_URL}/management/product/${partnerCode}`,
        axiosOptions(localStorage.getItem("token"))
      )
      .then((res) => res.data);
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
  }
});

export type FilterParams = {
  partner_code: string | undefined;
  product_code: string | undefined;
  product_type: string | undefined;
  months: number | undefined;
  state: boolean;
};
// Product filter
export const getProductsByFilter = createAsyncThunk<
  BaseResponseData<ContentTypes>,
  { params: FilterParams; page: number },
  { rejectValue: ErrorObject }
>("products/getByFilter", async ({ page, params }, { rejectWithValue }) => {
  try {
    return await axios
      .get(
        `${BASE_URL}/management/product/page/filter/products?page=${page}&product_code=${params.product_code}&partner_code=${params.partner_code}&product_type=${params.product_type}&months=${params.months}`,
        axiosOptions(localStorage.getItem("token"))
      )
      .then((res) => res.data);
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
  }
});

type ProductsInitTypes = {
  data: BaseResponseData<ContentTypes>;
  isTokenExp: boolean;
  fetching: FetchingTypes;
  createIsFetcing: FetchingTypes;
  successAlertState: boolean;
  message: string;
  partners: Array<ReactSelectValues>;
  partnersCodes: Array<ReactSelectValues>;
  productCodes: Array<ReactSelectValues>;
  filterParams: FilterParams;
};
const initialState: ProductsInitTypes = {
  fetching: "idle",
  isTokenExp: false,
  successAlertState: false,
  message: "",
  createIsFetcing: "idle",
  partners: [],
  partnersCodes: [],
  productCodes: [],
  filterParams: {
    partner_code: "",
    product_code: "",
    product_type: "",
    months: 0,
    state: false,
  },
  data: {
    content: [],
    total_elements: 0,
    number: 0,
    number_of_elements: 0,
    total_pages: 0,
  },
};

const products = createSlice({
  name: "products",
  initialState,
  reducers: {
    setIsTokenExp: (state, action: PayloadAction<boolean>) => {
      state.isTokenExp = action.payload;
    },
    setSuccessAlertState: (state, action: PayloadAction<boolean>) => {
      state.successAlertState = action.payload;
    },
    setFetchingTypes: (state, action: PayloadAction<FetchingTypes>) => {
      state.fetching = action.payload;
    },
    setPartners: (state, action: PayloadAction<Array<ReactSelectValues>>) => {
      state.partners = [...action.payload];
    },
    setPartnersCodes: (
      state,
      action: PayloadAction<Array<ReactSelectValues>>
    ) => {
      state.partnersCodes = [...action.payload];
    },
    setProductCodes: (state, action: PayloadAction<[]>) => {
      state.productCodes = action.payload;
    },
    setFilterParams: (state, action: PayloadAction<FilterParams>) => {
      state.filterParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state, action) => {
      state.fetching = "pending";
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.fetching = "success";
      state.data = { ...action.payload };
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.fetching = "failed";
      if (action.payload && action.payload.code === "401")
        state.isTokenExp = true;
    });
    builder.addCase(postProducts.pending, (state, action) => {
      state.createIsFetcing = "pending";
    });
    builder.addCase(postProducts.fulfilled, (state, action) => {
      state.createIsFetcing = "success";
      if (action.payload.code === "200") {
        state.message = action.payload.message || "";
        state.successAlertState = true;
      }
    });
    builder.addCase(postProducts.rejected, (state, action) => {
      state.createIsFetcing = "failed";
      if (action.payload && action.payload.code === "401")
        state.isTokenExp = true;
    });
    builder.addCase(getProductsByFilter.pending, (state, action) => {
      state.fetching = "pending";
    });
    builder.addCase(getProductsByFilter.fulfilled, (state, action) => {
      state.fetching = "success";
      state.data = { ...action.payload };
    });
    builder.addCase(getProductsByFilter.rejected, (state, action) => {
      state.fetching = "failed";
      if (action.payload && action.payload.code === "401")
        state.isTokenExp = true;
    });
    builder.addCase(getProductCodes.fulfilled, (state, action) => {
      let uniqueCodes: string[] = [];
      action.payload
        .map((item) => item.code)
        .forEach((item) => {
          if (!uniqueCodes.includes(item)) uniqueCodes.push(item);
        });

      state.productCodes = uniqueCodes.map((item) => ({
        value: item,
        label: item,
      }));
    });
  },
});

export const {
  setSuccessAlertState,
  setFetchingTypes,
  setPartners,
  setPartnersCodes,
  setProductCodes,
  setIsTokenExp,
  setFilterParams,
} = products.actions;

export default products.reducer;
