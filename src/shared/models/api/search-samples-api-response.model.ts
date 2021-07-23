export interface BaseSetApiResponse<T> {
  count: number;
  rows: T[];
}