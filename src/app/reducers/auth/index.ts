import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosOptions, BASE_URL } from "../../helpers";
import { ErrorObject, FetchingTypes } from "../../types";

type PostData = {
  login: string;
  password: string;
};
type ResponseData = {
  token: string;
};
export const login = createAsyncThunk<
  ResponseData,
  PostData,
  { rejectValue: ErrorObject }
>("auth/login", async (data: PostData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/auth`,
      data,
      axiosOptions(null)
    );
    localStorage.setItem("username", data.login);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data);
  }
});

type AuthInitTypes = {
  fetching: FetchingTypes;
  error: string;
  alertState: boolean;
  isAuth: boolean;
};
const initialState: AuthInitTypes = {
  fetching: "idle",
  error: "",
  alertState: false,
  isAuth: !!localStorage.getItem("token"),
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAlertState: (state, action: PayloadAction<boolean>) => {
      state.alertState = action.payload;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.fetching = "pending";
    });
    builder.addCase(
      login.fulfilled,
      (state, action: PayloadAction<{ token: string }>) => {
        state.fetching = "success";
        state.isAuth = true;
        localStorage.setItem("token", action.payload.token);
      }
    );
    builder.addCase(login.rejected, (state, { payload }) => {
      if (payload) {
        const code = payload.code ? parseInt(payload.code) : null;
        if (code) state.error = payload.message || "";
        else state.error = "Ошибка сервера";
        state.alertState = true;
      }
      state.fetching = "failed";
    });
  },
});

export const { setAlertState, setIsAuth } = auth.actions;

export default auth.reducer;
