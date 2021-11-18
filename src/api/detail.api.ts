import { BaseApiResponseModel } from "../shared/models/api/base-api-response.model";
import api from "./api.client";
import { ApiClinicalSampleModel } from "../shared/models/api/api-clinical-sample.model";
import { ApiClinicalGeneralInformationModel } from "../shared/models/api/api-clinical-general-information.model";
import { ApiPatientTreatmentHistoryModel } from "../shared/models/api/api-patient-treatment-history.model";
import { BaseSetApiResponse } from "../shared/models/api/search-samples-api-response.model";
import { ApiTreatmentResponsesModel } from "../shared/models/api/api-treatment-responses.model";
import {
  GenesFilterModel,
  TumourFilterModel,
} from "shared/models/filters.model";
import { ApiNgsModel } from "../shared/models/api/api-ngs.model";

export const getGeneralDetails = (
  modelId: string
): Promise<BaseApiResponseModel<ApiClinicalGeneralInformationModel>> =>
  api.get(`/details/general/${modelId}`);

export const getClinicalDetails = (
  modelId: string
): Promise<BaseApiResponseModel<ApiClinicalSampleModel>> =>
  api.get(`/details/clinical/${modelId}`);

export const getHistoryDetails = (
  modelId: string
): Promise<
  BaseApiResponseModel<BaseSetApiResponse<ApiPatientTreatmentHistoryModel>>
> => api.get(`/details/history/${modelId}`);

export const getResponsesDetails = (
  modelId: string,
  filters: TumourFilterModel[]
): Promise<BaseApiResponseModel<ApiTreatmentResponsesModel[]>> => {
  const urlSearchParams = new URLSearchParams();

  const primaries = filters.map((i) => i.primary);
  const subs = filters.map((i) => i.sub);

  if (primaries.length) {
    primaries.forEach((item) => {
      if (!item) return;
      if (Array.isArray(item) === true) item.forEach(value => urlSearchParams.append('tumourType', `${value}`))
      if (Array.isArray(item) === false) urlSearchParams.append('tumourType', `${item}`);
    });
  }

  if (subs.length) subs.forEach((value) => !value.length || urlSearchParams.append('tumourSubType', `${value}`));


  const searchString = urlSearchParams.toString();
  const query = searchString.length ? `?${searchString.toString()}` : "";
  return api.get(`/details/responses/${modelId}${query}`);
};

export const getNgsDetails = (
  modelId: string,
  filters: GenesFilterModel
): Promise<BaseApiResponseModel<ApiNgsModel>> => {
  const urlSearchParams = new URLSearchParams();

  const genes = filters.genes;
  const aliases = filters.aliases;
  const proteins = filters.proteins;

  if (genes.length) genes.forEach((value) => urlSearchParams.append('gene', `${value}`));
  if (aliases.length) aliases.forEach((value) => urlSearchParams.append('alias', `${value}`));
  if (proteins.length) proteins.forEach((value) => urlSearchParams.append('protein', `${value}`));
  if ("includeExpressions" in filters) urlSearchParams.append('includeExpressions', `${filters.includeExpressions}`)

  const searchString = urlSearchParams.toString();
  const query = searchString.length ? `?${searchString.toString()}` : "";
  return api.get(`/details/ngs/${modelId}${query}`, { timeout: 30000 });
};
