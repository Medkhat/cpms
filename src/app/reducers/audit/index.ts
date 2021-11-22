import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosOptions, BASE_URL } from "../../helpers";
import { BaseResponseData, ErrorObject, FetchingTypes } from "../../types";

export interface AuditContent {
  id: string;
  date: string;
  user: string;
  operation_type: {
    code: string;
    title: string;
  };
  partner_name: string;
  code: string;
}

export const getAudit = createAsyncThunk<
  BaseResponseData<AuditContent>,
  { auditType: "partners" | "products"; page: number },
  { rejectValue: ErrorObject }
>("audit/get", async ({ auditType, page }, { rejectWithValue }) => {
  try {
    return await axios
      .get(
        `${BASE_URL}/audit/page/${auditType}?page=${page}&sort=date,desc`,
        axiosOptions(localStorage.getItem("token"))
      )
      .then((res) => {
        return {
          ...res.data,
          content: res.data.content.map((item: any) => ({
            ...item,
            id: item._id,
            code: item.partner_code || item.product_code,
          })),
        };
      });
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
  }
});

export const getAuditDetails = createAsyncThunk<
  any,
  { id: string; auditType: "partners" | "products" },
  { rejectValue: ErrorObject }
>("audit/get/details", async ({ id, auditType }, { rejectWithValue }) => {
  try {
    return await axios
      .get(
        `${BASE_URL}/audit/${auditType}/${id}`,
        axiosOptions(localStorage.getItem("token"))
      )
      .then((res) => res.data);
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
  }
});

type AuditInitialState = {
  data: BaseResponseData<AuditContent>;
  fetching: FetchingTypes;
  isTokenExp: boolean;
  auditDetails: {
    id: string;
    date: string;
    operation_type_code: string;
    partner_code: string;
    product_code: string;
    partner_name: string;
    before_changes: any;
    after_changes: any;
    user: string;
  } | null;
};

const initialState: AuditInitialState = {
  data: {
    content: [],
    number: 0,
    number_of_elements: 0,
    total_elements: 0,
    total_pages: 0,
  },
  fetching: "idle",
  auditDetails: null,
  isTokenExp: false,
};

const audit = createSlice({
  name: "audit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAudit.pending, (state, action) => {
      state.fetching = "pending";
    });
    builder.addCase(getAudit.fulfilled, (state, action) => {
      state.fetching = "success";
      state.data = { ...action.payload };
    });
    builder.addCase(getAudit.rejected, (state, action) => {
      state.fetching = "failed";
      if (action.payload && action.payload.code === "401")
        state.isTokenExp = true;
    });
    builder.addCase(getAuditDetails.fulfilled, (state, action) => {
      state.auditDetails = { ...action.payload };
    });
    builder.addCase(getAuditDetails.rejected, (state, action) => {
      if (action.payload && action.payload.code === "401")
        state.isTokenExp = true;
    });
  },
});

export default audit.reducer;
