import api from "./api.client";
import { TumourFilterSubTypes } from "../shared/types/filter-types";

export const getFilteredData = (
  filterType: TumourFilterSubTypes,
  filterSubtype: string,
  search?: string,
  primaryFilter?: string
) => {
  const requestQuery = search ? `?search=${search}` : "";
  const primaryQueryValue = primaryFilter ? primaryFilter : "";
  let primaryQuery = "";

  /* We need to apply primary filter only to the sub filters.
   * Because only these type of filters are related to each other.  */

  if (filterSubtype === "sub") {
    if (search) {
      primaryQuery += `&primary=${primaryQueryValue}`;
    } else {
      primaryQuery = `?primary=${primaryQueryValue}`;
    }

    primaryQuery = primaryQuery.trim();
  }

  return api.get(
    `/filters/${filterType}/${filterSubtype}${requestQuery}${primaryQuery}`.trim()
  );
};

interface GetFilteredTumoursPSMixedParams {
  search: string;
  limit?: number;
  offset?: number;
}

export const getFilteredTumoursPSMixed = (params: GetFilteredTumoursPSMixedParams) => {
  const search = new URLSearchParams();
  const searchString = params.search.trim();
  if (searchString) search.append('search', searchString)
  if (params.limit && Number.isFinite(params.limit)) search.append('limit', params.limit.toString())
  if (params.offset && Number.isFinite(params.offset)) search.append('offset', params.offset.toString())
  return api.get(`/filters/tumours/mixed-primary-sub?${search.toString()}`)
}

export const getModelFilteredData = (search?: string) => {
  const requestQuery = search ? `?search=${search}` : "";
  return api.get(`/filters/models/${requestQuery}`);
};

export const getGeneFilteredData = (search?: string, offset: number = 0) => {
  const requestQuery = search
    ? `?search=${search}&limit=${process.env.REACT_APP_GENE_PAGE_LIMIT}&offset=${offset}`
    : "";
  return api.get(`/filters/genes/${requestQuery}`);
};
