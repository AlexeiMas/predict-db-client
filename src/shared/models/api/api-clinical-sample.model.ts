export interface ApiClinicalSampleModel {
  _id: string;
  Age: number;
  "Case ID": string;
  "Clinical Biomarkers of Interest (Immune)": string[];
  "Clinical Biomarkers of Interest (non-immune)": string[];
  "Date Created": string;
  Diagnosis: string;
  Differentiation: string;
  Ethnicity: string;
  "Growth Kinetics": string;
  Histology: string[];
  "Breast Cancer Receptor Status": string[];
  Origin: string;
  "PDC Model": string;
  "Primary Tumour Type": string;
  "Procedure Type": string;
  "SNOMED ID": string;
  "Sample Collection Site": string;
  "Sample Type": string;
  Sex: string;
  "Smoking History": string;
  Stage: string;
  "Treatment Status": string;
  "Tumour Sub-type": string;
  Model: {
    "Has NGS Data": boolean;
    "Has Patient Treatment History": boolean;
    "Has Growth Characteristics": boolean;
    "Has Plasma": boolean;
    "Has PBMC": boolean;
    TreatmentResponsesCount: number;
  };
}
