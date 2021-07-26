export interface ApiPatientTreatmentHistoryModel {
  _id: string;
  "Best Response (RECIST)": string;
  "Date Started": string;
  "Date of Last Treatment": string;
  "Pre/Post Collection": string;
  "PredictRx Case ID": string;
  Regime: string;
  Treatment: string;
  "Treatment Duration (Months)": number;
  "Dose  (mg/day or mg/kg)": string;
}