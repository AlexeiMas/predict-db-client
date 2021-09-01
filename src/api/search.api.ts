import api from "./api.client";
import { BaseApiResponseModel } from "../shared/models/api/base-api-response.model";
import { BaseSetApiResponse } from "../shared/models/api/search-samples-api-response.model";
import { ApiClinicalSampleModel } from "../shared/models/api/api-clinical-sample.model";
import { FilterModel } from "../shared/models/filters.model";

const getApiQuery = (
  limit: number,
  offset: number,
  filters?: FilterModel,
  sort?: string,
  order?: string
): string => {
  let searchQuery = "?";

  searchQuery += `limit=${limit}`;
  searchQuery += `&offset=${offset * limit}`;

  if (filters) {
    if (filters.modelType) {
      filters.modelType.forEach((value) => {
        searchQuery += `&modelId=${value}`;
      });
    }

    if (filters.geneType) {
      filters.geneType.genes.forEach((value) => {
        searchQuery += `&gene=${value}`;
      });
      filters.geneType.aliases.forEach((value) => {
        searchQuery += `&alias=${value}`;
      });
      filters.geneType.proteins.forEach((value) => {
        searchQuery += `&protein=${value}`;
      });

      if (filters.geneType.includeExpressions !== null) {
        searchQuery += `&includeExpressions=${filters.geneType.includeExpressions}`;
      }
    }

    if (filters.tumourType) {
      filters.tumourType.forEach((item) => {
        if (item.primary) {
          item.primary.map(p => searchQuery += `&tumourType=${p}`);
        }
        if (item.sub) {
          item.sub.forEach((value) => {
            searchQuery += `&tumourSubType=${value}`;
          });
        }
      });
    }

    if (filters.historyType) {
      filters.historyType.forEach((item) => {
        if (item.treatment) {
          item.treatment.forEach((value) => {
            searchQuery += `&historyTreatment=${value}`;
          });
        }
        if (item.response) {
          item.response.forEach((value) => {
            searchQuery += `&historyResponseType=${value}`;
          });
        }
      });
    }

    if (filters.responsesType) {
      filters.responsesType.forEach((item) => {
        if (item.treatment) {
          item.treatment.forEach((value) => {
            searchQuery += `&responsesTreatment=${value}`;
          });
        }
        if (item.response) {
          item.response.forEach((value) => {
            searchQuery += `&responsesResponseType=${value}`;
          });
        }
      });
    }

    if (filters.dataAvailable) {
      filters.dataAvailable.forEach((value) => {
        searchQuery += `&dataAvailable=${value}`;
      })
    }
  }

  if (sort) searchQuery += `&sort=${sort}`;
  if (order) searchQuery += `&order=${order}`;

  return searchQuery;
};

export const searchItems = (
  limit: number,
  offset: number,
  filters?: FilterModel,
  sort?: string,
  order?: string
): Promise<BaseApiResponseModel<BaseSetApiResponse<ApiClinicalSampleModel>>> =>
  api.get("/search" + getApiQuery(limit, offset, filters, sort, order));
