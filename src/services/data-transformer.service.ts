import { ApiClinicalSampleModel } from "../shared/models/api/api-clinical-sample.model";
import { ClinicalSampleModel } from "../shared/models/clinical-sample.model";
import { ApiClinicalGeneralInformationModel } from "../shared/models/api/api-clinical-general-information.model";
import { ClinicalGeneralInformationModel } from "../shared/models/clinical-general-information.model";
import { ApiPatientTreatmentHistoryModel } from "../shared/models/api/api-patient-treatment-history.model";
import { PatientTreatmentHistoryModel } from "../shared/models/patient-treatment-history.model";
import { ApiTreatmentResponsesModel } from "../shared/models/api/api-treatment-responses.model";
import { TreatmentResponseModel } from "../shared/models/treatment-response.model";

class DataTransformerService {
  public transformSamplesToFrontEndFormat(
    samples: ApiClinicalSampleModel[]
  ): ClinicalSampleModel[] {
    return samples.map((sample: ApiClinicalSampleModel) => {
      return this.transformSampleToFrontEndFormat(sample);
    });
  }

  public transformSampleToFrontEndFormat(
    sample: ApiClinicalSampleModel
  ): ClinicalSampleModel {
    return {
      id: sample["_id"],
      age: sample["Age"],
      caseId: sample["Case ID"],
      clinicalBiomarkersOfInterestImmune:
        sample["Clinical Biomarkers of Interest (Immune)"],
      clinicalBiomarkersOfInterestNonImmune:
        sample["Clinical Biomarkers of Interest (non-immune)"],
      dataCreated: sample["date_created"],
      diagnosis: sample["Diagnosis"],
      differentiation: sample["Differentiation"],
      ethnicity: sample["Ethnicity"],
      growthKinetics: sample["Growth Kinetics"],
      histology: sample["Histology"],
      ReceptorStatus: sample["Receptor Status"],
      pdcModel: sample["PDC Model"],
      primaryTumourType: sample["Primary Tumour Type"],
      procedureType: sample["Procedure Type"],
      meshId: sample["NIH MeSH Tree Number"],
      sampleCollectionSite: sample["Sample Collection Site"],
      sampleType: sample["Sample Type"],
      sex: sample["Sex"],
      smokingHistory: sample["Smoking History"],
      stage: sample["Stage"],
      treatmentStatus: sample["Treatment Status"],
      tumourSubType: sample["Tumour Sub-type"],
      hasNgsData: sample["Model"] && sample["Model"]["Has NGS Data"],
      hasPatientTreatmentHistory:
        sample["Model"] && sample["Model"]["Has Patient Treatment History"],
      hasGrowthCharacteristics:
        sample["Model"] && sample["Model"]["Has Growth Characteristics"],
      hasResponseData:
        sample["Model"] && sample["Model"].TreatmentResponsesCount > 0,
      Plasma: sample["Plasma"],
      PBMC: sample["PBMC"],
    };
  }

  public transformGeneralInformationToFrontEndFormat(
    info: ApiClinicalGeneralInformationModel
  ): ClinicalGeneralInformationModel {
    return {
      id: info["_id"],
      modelStatus3D: info["3D Model Status"],
      confirmedProteinExpression: info["Confirmed Protein Expression"],
      growthCharacteristics: info["Growth Characteristics"],
      hasGrowthCharacteristics: info["Has Growth Characteristics"]
        ? "Yes"
        : "No",
      hasNGSData: info["Has NGS Data"] ? "Yes" : "No",
      hasPatientTreatmentHistory: info["Has Patient Treatment History"]
        ? "Yes"
        : "No",
      microsateliteStatus: info["Microsatelite Status"],
      modelId: info["Model ID"],
      ngs: info["NGS"],
      patientSequentialModels: info["Patient Sequential Models"],
      tumourMutationBurdenStatus: info["Tumour Mutation Burden Status"],
      modelStatus: info["Model Status"],
      hla: info.hla.alleles,
      hasResponseData: info["Has PredictRx Response Data"] ? "Yes" : "No",
    };
  }

  public transformTreatmentResponsesToFrontEndFormat(
    responses: ApiTreatmentResponsesModel[]
  ): TreatmentResponseModel[] {
    return responses.map((response: ApiTreatmentResponsesModel) => {
      return {
        id: response["_id"],
        modelId: response["Model ID"],
        phenotypicResponseType: response["Phenotypic Response Type"],
        responsePercentile: response["Response Percentile"],
        treatment: response["Treatment"],
        treatmentType: response["Treatment Type"],
      };
    });
  }

  public transformPatientTreatmentHistoryToFrontEndFormat(
    histories: ApiPatientTreatmentHistoryModel[]
  ): PatientTreatmentHistoryModel[] {
    return histories.map((history: ApiPatientTreatmentHistoryModel) => {
      return {
        id: history["_id"],
        bestResponseRecist: history["Best Response (RECIST)"],
        dateStarted: history["Date Started"],
        dateOfLastTreatment: history["Date of Last Treatment"],
        prePostCollection: history["Pre/Post Collection"],
        predictRxCaseId: history["PredictRx Case ID"],
        regime: history["Regime"],
        treatment: history["Treatment"],
        treatmentDurationMonths: history["Treatment Duration (Months)"],
        dose: history["Dose  (mg/day or mg/kg)"],
        responseDurationMonths: history["Response Duration (Months)"]
      };
    });
  }
}

export default new DataTransformerService();
