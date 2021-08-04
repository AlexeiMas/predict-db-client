export interface FilterModel {
  tumourType: TumourFilterModel[];
  historyType: PatientTreatmentHistoryFilterModel[];
  responsesType: ResponsesFilterModel[];
  modelType: string[];
  geneType: GenesFilterModel;
}

export interface TumourFilterModel {
  primary: string[];
  sub: string[];
  [key: string]: any;
}

export interface ResponsesFilterModel {
  treatment: string[];
  response: string[];
}

export interface PatientTreatmentHistoryFilterModel {
  treatment: string[];
  response: string[];
}

export interface GenesFilterModel {
  genes: string[];
  aliases: string[];
  proteins: string[];
  includeExpressions: boolean;
}
