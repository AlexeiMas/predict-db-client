import fileDownload from "js-file-download";
import { FilterModel } from "shared/models/filters.model";
import api from "./api.client";

const getApiQuery = (filters?: FilterModel): string => {
  const urlSearchParams = new URLSearchParams();

  if (filters) {
    if (filters.modelType) filters.modelType.forEach((value) => urlSearchParams.append('modelId', `${value}`));

    if (filters.geneType) {
      filters.geneType.genes.forEach((value) => urlSearchParams.append('gene', `${value}`));
      filters.geneType.aliases.forEach((value) => urlSearchParams.append('alias', `${value}`));
      filters.geneType.proteins.forEach((value) => urlSearchParams.append('protein', `${value}`));
      if (filters.geneType.includeExpressions !== null) urlSearchParams.append('includeExpressions', `${filters.geneType.includeExpressions}`)
    }

    if (filters.tumourType) {
      filters.tumourType.forEach((item) => {
        if (item.primary) item.primary.forEach(tumourType => urlSearchParams.append('tumourType', tumourType))
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

  const searchString = urlSearchParams.toString();
  return searchString.length ? `?${searchString}` : "";
};

export const exportData = (filters?: FilterModel) => {
  return api
    .get("/export" + getApiQuery(filters), { responseType: "blob", timeout: 90000 })
    .then((response) => {
      if (response && "data" in response) fileDownload(response.data, `PTX_Data_Export_${new Date().toLocaleDateString()}.xlsx`);
      return true;
    });
};