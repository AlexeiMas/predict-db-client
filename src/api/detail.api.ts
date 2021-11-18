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
  let query = "";

  const primaries = filters.map((i) => i.primary);
  const subs = filters.map((i) => i.sub);

  if (primaries.length) {
    primaries.forEach((item) => {
      if (item) {
        const tumours = Array.isArray(item)
          ? item.map(i => `tumourType=${i}`)
          : `tumourType=${item}`
        query += query.length ? `&${tumours}` : `?${tumours}`;
      }
    });
  }

  if (subs.length) {
    subs.forEach((item) => {
      if (item.length)
        query += query.length
          ? `&tumourSubType=${item}`
          : `?tumourSubType=${item}`;
    });
  }

  return api.get(`/details/responses/${modelId}${query}`);
};

export const getNgsDetails = (
  modelId: string,
  filters: GenesFilterModel
): Promise<BaseApiResponseModel<ApiNgsModel>> => {
  let query = "";

  const genes = filters.genes;
  const aliases = filters.aliases;
  const proteins = filters.proteins;
  const includeExpressions = filters.includeExpressions;

  if (genes.length) {
    genes.forEach((item) => {
      query += query.length ? `&gene=${item}` : `?gene=${item}`;
    });
  }

  if (aliases.length) {
    aliases.forEach((item) => {
      query += query.length ? `&alias=${item}` : `?alias=${item}`;
    });
  }

  if (proteins.length) {
    proteins.forEach((item) => {
      query += query.length ? `&protein=${item}` : `?protein=${item}`;
    });
  }

  if (includeExpressions) {
    query += query.length
      ? `&includeExpressions=${includeExpressions}`
      : `?includeExpressions=${includeExpressions}`;
  }

  return api.get(`/details/ngs/${modelId}${query}`, { timeout: 30000 });
};
