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
  const urlSearchParams = new URLSearchParams();

  if (Number.isFinite(limit)) urlSearchParams.append('limit', `${limit}`)
  if (Number.isFinite(offset) && Number.isFinite(limit)) urlSearchParams.append('offset', `${offset * limit}`)

  if (filters) {
    if (filters.modelType) filters.modelType.forEach((value) => urlSearchParams.append('modelId', `${value}`));

    if (filters.geneType) {
      filters.geneType.genes.forEach((value) => urlSearchParams.append('gene', `${value}`));
      filters.geneType.aliases.forEach((value) => urlSearchParams.append('alias', `${value}`));
      filters.geneType.proteins.forEach((value) => urlSearchParams.append('protein', `${value}`));
      if (filters.geneType.includeExpressions !== null) urlSearchParams.append('includeExpressions', `${filters.geneType.includeExpressions}`);
    }

    if (filters.tumourType) {
      filters.tumourType.forEach((item) => {
        if (item.primary) item.primary.forEach(value => urlSearchParams.append('tumourType', `${value}`));
        if (item.sub) item.sub.forEach((value) => urlSearchParams.append('tumourSubType', `${value}`));
      });
    }

    if (filters.historyType) {
      filters.historyType.forEach((item) => {
        if (item.treatment) item.treatment.forEach((value) => urlSearchParams.append('historyTreatment', `${value}`));
        if (item.response) item.response.forEach((value) => urlSearchParams.append('historyResponseType', `${value}`));
      });
    }

    if (filters.responsesType) {
      filters.responsesType.forEach((item) => {
        if (item.treatment) item.treatment.forEach((value) => urlSearchParams.append('responsesTreatment', `${value}`));
        if (item.response) item.response.forEach((value) => urlSearchParams.append('responsesResponseType', `${value}`));
      });
    }

    if (filters.dataAvailable) filters.dataAvailable.forEach((value) => urlSearchParams.append('dataAvailable', `${value}`));
  }

  if (sort) urlSearchParams.append('sort', `${sort}`);
  if (order) urlSearchParams.append('order', `${order}`);

  const searchString = urlSearchParams.toString();
  return searchString.length ? `?${searchString}` : "";
};

export const searchItems = (
  limit: number,
  offset: number,
  filters?: FilterModel,
  sort?: string,
  order?: string
): Promise<BaseApiResponseModel<BaseSetApiResponse<ApiClinicalSampleModel>>> =>
  api.get("/search" + getApiQuery(limit, offset, filters, sort, order));
