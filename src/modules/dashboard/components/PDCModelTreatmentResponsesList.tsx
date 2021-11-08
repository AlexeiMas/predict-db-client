import React, { useEffect, useState } from "react";

import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import { getResponsesDetails } from "../../../api/detail.api";

import dataTransformer from "../../../services/data-transformer.service";
import Preloader from "../../../shared/components/Preloader";
import { TreatmentResponseModel } from "../../../shared/models/treatment-response.model";
import { TumourFilterModel } from "shared/models/filters.model";
import InfoIcon from "../../../shared/components/Icons/InfoIcon";
import { useQuery } from '../pages/Dashboard';
import { useHistory } from 'react-router-dom';

interface PDCModelTreatmentResponsesListProps {
  selectedElement: ClinicalSampleModel;
  filters: TumourFilterModel[];
}

const PDCModelTreatmentResponsesList = ({
  selectedElement,
  filters,
}: PDCModelTreatmentResponsesListProps): JSX.Element => {
  const history = useHistory()
  const [preloader, togglePreloader] = useState(true);
  const [responses, setResponses] = useState(
    null as unknown as TreatmentResponseModel[]
  );
  const query = useQuery()

  const UNMOUNTED = 'unmounted'
  const NOT_FOUND = 'Not found';
  const logReason = (reason: any) => reason === UNMOUNTED || console.log('[ reason ]', reason);

  const loadResponsesInfo = () => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; logReason(reason) })

    const setState = (data: any) => {
      if (data === NOT_FOUND) return history.push('/not-found')
      const transformedData =
        dataTransformer.transformTreatmentResponsesToFrontEndFormat(data);
      return canceled || setResponses(transformedData);
    }

    if (!canceled) {
      const ModelID = query.get("Model_ID") as string;
      getResponsesDetails(ModelID, filters)
        .then(success => canceled || success.data)
        .then(success => canceled || !success || setState(success))
        .catch(cancel)
        .finally(() => canceled || togglePreloader(false))
    }

    return cancel;
  };


  useEffect(() => {
    const cancel = loadResponsesInfo();
    return () => { cancel(UNMOUNTED) }
  }, []); // eslint-disable-line


  const getClassForPhenotypicResponseType = (value: string): string => {
    if (value === "Positive") {
      return "box positive-box";
    }

    if (value === "Intermediate") {
      return "box intermediate-box";
    }

    if (value === "Negative") {
      return "box negative-box";
    }

    return "box neutral-box";
  };

  const isTumourFilterUsed = () => !!(filters[0] && filters[0].primary);

  return (
    <>
      {preloader && <Preloader />}
      {!preloader && !isTumourFilterUsed() && (
        <div className="empty">
          <h2 className="empty__title">No results found</h2>
          <div className="empty__text">
            Either select a tumour type from the filter criteria or there are no
            treatments with an indication for the selected tumour type.
          </div>
        </div>
      )}
      {!preloader && isTumourFilterUsed() && responses && !responses.length && (
        <div className="empty">
          <h2 className="empty__title">No results found</h2>
          <div className="empty_text">
            No PDC model treatment responses available. This means there are no treatments with an indication for the selected tumour type. Contact us for full panel of treatment responses.
          </div>
        </div>
      )}
      {!preloader && isTumourFilterUsed() && responses && !!responses.length && (
        <>
          <div className="drawer__notice-message">
            Only treatments indicated for cancer type shown. Contact us for full
            panel of treatment responses.
          </div>

          {responses.map((response: TreatmentResponseModel, index: number) => (
            <div className="response-block" key={index}>
              <div className="drawer-tabs-row">
                <div className="drawer-tabs-row__label">
                  Treatment
                  <InfoIcon title="Treatment" />
                </div>
                <div className="drawer-tabs-row__value">
                  {response.treatment}
                </div>
              </div>
              <div className="drawer-tabs-row">
                <div className="drawer-tabs-row__label">
                  Response percentile
                  <InfoIcon title="Response percentile" />
                </div>
                <div className="drawer-tabs-row__value">
                  {response.responsePercentile}
                </div>
              </div>
              <div className="drawer-tabs-row">
                <div className="drawer-tabs-row__label">
                  Phenotypic response to clinical drugs type
                  <InfoIcon
                    title={
                      <>
                        A "positive" response represents a 90%+ score for
                        indicated treatments, and 66%+ score for non-indicated
                        treatments.
                        <br />
                        <br />
                        An "intermediate" response represents a 70 – 90% score
                        for indicated treatments, and 45 – 66% score for
                        non-indicated treatments.
                      </>
                    }
                  />
                </div>
                <div className={"drawer-tabs-row__value"}>
                  <span
                    className={getClassForPhenotypicResponseType(
                      response.phenotypicResponseType
                    )}
                  >
                    {response.phenotypicResponseType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default PDCModelTreatmentResponsesList;
