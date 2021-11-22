// This file contains commonly reducer or component types

export type ReactSelectValues = {
  value: string | number;
  label: string;
};
export type FetchingTypes = "idle" | "pending" | "success" | "failed";
export type ErrorObject = {
  code?: string;
  debug?: string;
  message?: string;
  status?: string;
};
export type PostResponseData = {
  code?: string;
  id?: string;
  message?: string;
  status?: string;
};
export interface BaseResponseData<T> {
  content: Array<T>;
  total_elements: number;
  number: number;
  number_of_elements: number;
  total_pages: number;
}
