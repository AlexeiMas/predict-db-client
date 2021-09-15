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
        if (searchQuery !== "?") searchQuery += "&";
        searchQuery += `includeExpressions=${filters.geneType.includeExpressions}`;
      }
    }

    if (filters.tumourType) {
      filters.tumourType.forEach((item) => {
        if (item.primary) {
          if (searchQuery !== "?") {
            item.primary.map(p => searchQuery += `&tumourType=${p}`);
          } else {
            for (let i = 0; i < item.length; i++) {
              if (i === 0) {
                searchQuery += `tumourType=${item.primary[i]}`;
              } else {
                searchQuery += `&tumourType=${item.primary[i]}`;
              }
            }
          }
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
    .get("/export" + getApiQuery(filters), { responseType: "blob", timeout: 90000 })
    .then((response) => {
      fileDownload(
        response.data,
        `PTX_Data_Export_${new Date().toLocaleDateString()}.xlsx`
      );
      return true;
    });
};
