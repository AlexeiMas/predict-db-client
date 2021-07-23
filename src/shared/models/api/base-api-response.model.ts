import { AxiosResponse } from "axios";

export interface BaseApiResponseModel<T> extends AxiosResponse {
  data: T;
}