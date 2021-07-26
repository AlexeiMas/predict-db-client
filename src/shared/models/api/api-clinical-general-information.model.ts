export interface ApiClinicalGeneralInformationModel {
  "3D Model Status": string;
  "Confirmed Protein Expression": string;
  "Growth Characteristics": string;
  "Has Growth Characteristics": boolean;
  "Has NGS Data": boolean;
  "Has Patient Treatment History": boolean;
  "Microsatelite Status": string;
  "Model ID": string;
  NGS: string;
  "Patient Sequential Models": string;
  "Tumour Mutation Burden Status": string;
  "Model Status": string;
  hla: {
    alleles: [string];
  };
  "Has PredictRx Response Data": string;
  _id: string;
}
