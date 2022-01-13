import api from "./api.client";
import { TumourFilterSubTypes } from "../shared/types/filter-types";
import * as analytics from '../analytics';

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

  const path = `/filters/${filterType}/${filterSubtype}${requestQuery}${primaryQuery}`.trim();
  analytics.GTM_SRV.sendEvent({ event: analytics.GTM_SRV.events.SEARCH, SEARCH: path })
  return api.get(path);
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
  const path = `/filters/tumours/mixed-primary-sub?${search.toString()}`
  analytics.GTM_SRV.sendEvent({ event: analytics.GTM_SRV.events.SEARCH, SEARCH: path })
  return api.get(path)
}

export const getModelFilteredData = (search?: string) => {
  const requestQuery = search ? `?search=${search}` : "";
  const path = `/filters/models/${requestQuery}`;
  return api.get(path);
};

export const getGeneFilteredData = (search?: string, offset = 0) => {
  const requestQuery = search
    ? `?search=${search}&limit=${process.env.REACT_APP_GENE_PAGE_LIMIT}&offset=${offset}`
    : "";
  const path = `/filters/genes/${requestQuery}`;
  analytics.GTM_SRV.sendEvent({ event: analytics.GTM_SRV.events.SEARCH, SEARCH: path })
  return api.get(path);
};
