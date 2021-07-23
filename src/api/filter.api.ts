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
