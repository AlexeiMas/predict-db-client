import api from "./api.client";
import { TumourFilterSubTypes } from "../shared/types/filter-types";

export const getFilteredData = (
  filterType: TumourFilterSubTypes,
  filterSubtype: string,
  search?: string,
  primaryFilter?: string
) => {
  const urlSearchParams = new URLSearchParams();
  if (search?.length) urlSearchParams.append('search', `${search}`)

  /* We need to apply primary filter only to the sub filters.
   * Because only these type of filters are related to each other.  */
  if (filterSubtype === "sub" && primaryFilter?.length) urlSearchParams.append('primary', `${primaryFilter}`)

  const searchString = urlSearchParams.toString()
  const meQuery = searchString.length ? `?${searchString}` : ""
  return api.get(`/filters/${filterType}/${filterSubtype}${meQuery}`);
};

interface GetFilteredTumoursPSMixedParams { search: string; limit?: number; offset?: number; }
export const getFilteredTumoursPSMixed = (params: GetFilteredTumoursPSMixedParams) => {
  const urlSearchParams = new URLSearchParams();
  if (params.search.trim()) urlSearchParams.append('search', `${params.search.trim()}`)
  if (params.limit && Number.isFinite(params.limit)) urlSearchParams.append('limit', `${params.limit}`)
  if (params.offset && Number.isFinite(params.offset)) urlSearchParams.append('offset', `${params.offset}`)
  return api.get(`/filters/tumours/mixed-primary-sub?${urlSearchParams.toString()}`)
}

export const getModelFilteredData = (search?: string) => {
  const urlSearchParams = new URLSearchParams();
  if (search?.length) urlSearchParams.append('search', `${search}`);
  const searchString = urlSearchParams.toString()
  const requestQuery = searchString.length ? `?${searchString}` : ""
  return api.get(`/filters/models/${requestQuery}`);
};

export const getGeneFilteredData = (search?: string[], offset: number = 0) => {
  const urlSearchParams = new URLSearchParams();
  if (search?.length) {
    search.forEach(value => urlSearchParams.append('search', `${value}`))
    urlSearchParams.append('limit', `${process.env.REACT_APP_GENE_PAGE_LIMIT}`)
    urlSearchParams.append('offset', `${offset}`)
  }
  const searchString = urlSearchParams.toString();
  const requestQuery = searchString.length ? `?${searchString}` : "";
  return api.get(`/filters/genes/${requestQuery}`);
};
