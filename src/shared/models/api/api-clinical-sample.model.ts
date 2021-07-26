export interface ApiClinicalSampleModel {
  _id: string;
  Age: number;
  "Case ID": string;
  "Clinical Biomarkers of Interest (Immune)": string;
  "Clinical Biomarkers of Interest (non-immune)": string;
  "date_created": string;
  Diagnosis: string;
  Differentiation: string;
  Ethnicity: string;
  "Growth Kinetics": string;
  Histology: string;
  "Receptor Status": string;
  "PDC Model": string;
  "Primary Tumour Type": string;
  "Procedure Type": string;
  "NIH MeSH Tree Number": string;
  "Sample Collection Site": string;
  "Sample Type": string;
  Sex: string;
  "Smoking History": string;
  Stage: string;
  PBMC: boolean;
  Plasma: boolean;
  "Treatment Status": string;
  "Tumour Sub-type": string;
  Model: {
    "Has NGS Data": boolean;
    "Has Patient Treatment History": boolean;
    "Has Growth Characteristics": boolean;
    TreatmentResponsesCount: number;
  };
}
