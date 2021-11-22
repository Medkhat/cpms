import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosOptions, BASE_URL } from "../../helpers";
import { ErrorObject, FetchingTypes, PostResponseData } from "../../types";
import { setPartners, setPartnersCodes } from "../products";

interface BasePartnerFields {
  code: string;
  state: string;
  name: string;
  guid: string;
  image_url: string;
  is_broker_member: boolean;
  display_priority: number;
}

export interface PartnerTypes extends BasePartnerFields {
  id: string;
  state_title: string;
}

export interface PartnerFormData extends BasePartnerFields {
  products: [];
  id?: string;
  method: "post" | "put";
}

export const getPartners = createAsyncThunk<
  Array<PartnerTypes>,
  undefined,
  { rejectValue: ErrorObject }
>("partners/get", async (_, { rejectWithValue, dispatch }) => {
  try {
    return await axios
      .get(
        `${BASE_URL}/management/partner/partners`,
        axiosOptions(localStorage.getItem("token"))
      )
      .then((res) => {
        dispatch(
          setPartners(
            res.data.map((item: PartnerTypes) => ({
              value: item.id,
              label: item.name,
            }))
          )
        );
        dispatch(
          setPartnersCodes(
            res.data.map((item: PartnerTypes) => ({
              value: item.code,
              label: item.name,
            }))
          )
        );
        return res.data;
      });
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
  }
});

export const postPartners = createAsyncThunk<
  PostResponseData,
  PartnerFormData,
  { rejectValue: ErrorObject }
>(
  "patners/post",
  async ({ method, ...data }, { rejectWithValue, dispatch }) => {
    try {
      return method === "post"
        ? await axios
            .post(
              `${BASE_URL}/management/partner`,
              data,
              axiosOptions(localStorage.getItem("token"))
            )
            .then((res) => {
              dispatch(getPartners());
              return res.data;
            })
        : await axios
            .put(
              `${BASE_URL}/management/partner`,
              data,
              axiosOptions(localStorage.getItem("token"))
            )
            .then((res) => {
              dispatch(getPartners());
              return res.data;
            });
    } catch (err) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
    }
  }
);

type PartnersState = {
  data: Array<PartnerTypes>;
  fetching: FetchingTypes;
  addFetching: FetchingTypes;
  successAlertState: boolean;
  failedAlertState: boolean;
  message: string;
  isTokenExp: boolean;
};

const initialState: PartnersState = {
  data: [],
  fetching: "idle",
  addFetching: "idle",
  failedAlertState: false,
  successAlertState: false,
  message: "",
  isTokenExp: false,
};

const partners = createSlice({
  name: "partners",
  initialState,
  reducers: {
    setIsTokenExp: (state, action: PayloadAction<boolean>) => {
      state.isTokenExp = action.payload;
    },
    setPartnersSuccessAlertState: (state, action: PayloadAction<boolean>) => {
      state.successAlertState = action.payload;
    },
    setPartnersFailedAlertState: (state, action: PayloadAction<boolean>) => {
      state.failedAlertState = action.payload;
    },
    setAddFetching: (state, action: PayloadAction<FetchingTypes>) => {
      state.addFetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPartners.pending, (state, action) => {
      state.fetching = "pending";
    });
    builder.addCase(
      getPartners.fulfilled,
      (state, action: PayloadAction<Array<PartnerTypes>>) => {
        state.fetching = "success";
        state.data = [...action.payload];
      }
    );
    builder.addCase(getPartners.rejected, (state, action) => {
      state.fetching = "failed";
      if (action.payload?.code === "401") {
        state.isTokenExp = true;
      } else {
        state.successAlertState = true;
        state.message = action.payload?.message || "Ошибка сервера";
      }
    });
    builder.addCase(postPartners.pending, (state, action) => {
      state.addFetching = "pending";
    });
    builder.addCase(postPartners.fulfilled, (state, action) => {
      state.addFetching = "success";
      state.successAlertState = true;
      state.message = action.payload.message || "Успешно";
    });
    builder.addCase(postPartners.rejected, (state, action) => {
      state.addFetching = "failed";
      if (action.payload?.code === "401") {
        state.isTokenExp = true;
      } else {
        state.failedAlertState = true;
        state.message = action.payload?.message || "Ошибка сервера";
      }
    });
  },
});

export const {
  setPartnersSuccessAlertState,
  setPartnersFailedAlertState,
  setAddFetching,
  setIsTokenExp,
} = partners.actions;

export default partners.reducer;
