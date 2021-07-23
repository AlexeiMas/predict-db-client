import fileDownload from "js-file-download";
import { FilterModel } from "shared/models/filters.model";
import api from "./api.client";

const getApiQuery = (filters?: FilterModel): string => {
  let searchQuery = "?";

  if (filters) {
    if (filters.modelType) {
      filters.modelType.forEach((value) => {
        if (searchQuery !== "?") searchQuery += "&";
        searchQuery += `modelId=${value}`;
      });
    }

    if (filters.geneType) {
      filters.geneType.genes.forEach((value) => {
        if (searchQuery !== "?") searchQuery += "&";
        searchQuery += `gene=${value}`;
      });
      filters.geneType.aliases.forEach((value) => {
        if (searchQuery !== "?") searchQuery += "&";
        searchQuery += `alias=${value}`;
      });
      filters.geneType.proteins.forEach((value) => {
        if (searchQuery !== "?") searchQuery += "&";
        searchQuery += `protein=${value}`;
      });

      if (filters.geneType.includeExpressions !== null) {
        searchQuery += `&includeExpressions=${filters.geneType.includeExpressions}`;
      }
    }

    if (filters.tumourType) {
      filters.tumourType.forEach((item) => {
        if (item.primary) {
          if (searchQuery !== "?") searchQuery += "&";
          searchQuery += `tumourType=${item.primary}`;
        }
        if (item.sub) {
          item.sub.forEach((value) => {
            if (searchQuery !== "?") searchQuery += "&";
            searchQuery += `tumourSubType=${value}`;
          });
        }
      });
    }

    if (filters.historyType) {
      filters.historyType.forEach((item) => {
        if (item.treatment) {
          item.treatment.forEach((value) => {
            if (searchQuery !== "?") searchQuery += "&";
            searchQuery += `historyTreatment=${value}`;
          });
        }
        if (item.response) {
          item.response.forEach((value) => {
            if (searchQuery !== "?") searchQuery += "&";
            searchQuery += `historyResponseType=${value}`;
          });
        }
      });
    }

    if (filters.responsesType) {
      filters.responsesType.forEach((item) => {
        if (item.treatment) {
          item.treatment.forEach((value) => {
            if (searchQuery !== "?") searchQuery += "&";
            searchQuery += `responsesTreatment=${value}`;
          });
        }
        if (item.response) {
          item.response.forEach((value) => {
            if (searchQuery !== "?") searchQuery += "&";
            searchQuery += `responsesResponseType=${value}`;
          });
        }
      });
    }
  }

  return searchQuery;
};

export const exportData = (filters?: FilterModel) => {
  return api
    .get("/export" + getApiQuery(filters), { responseType: "blob" })
    .then((response) => {
      fileDownload(
        response.data,
        `PTX_Data_Export_${new Date().toLocaleDateString()}.xlsx`
      );
      return true;
    });
};
