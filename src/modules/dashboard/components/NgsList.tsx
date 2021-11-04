import React, { useEffect, useState } from "react";
import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import { getNgsDetails } from "../../../api/detail.api";
import Preloader from "../../../shared/components/Preloader";
import { ApiNgsModel } from '../../../shared/models/api/api-ngs.model';
import { GenesFilterModel } from "shared/models/filters.model";
import { GeneAliasIcon, GeneIcon, ProteinIcon } from "shared/components/Icons";
import InfoIcon from "shared/components/Icons/InfoIcon";
import { useQuery } from '../pages/Dashboard';
import { useHistory } from 'react-router-dom';

interface MutationsListProps {
  selectedElement: ClinicalSampleModel;
  filters: GenesFilterModel;
}

const MutationsList = ({
  selectedElement,
  filters,
}: MutationsListProps): JSX.Element => {
  const history = useHistory()
  const [preloader, togglePreloader] = useState(true);
  const [ngs, setNgs] = useState(
    null as unknown as ApiNgsModel
  );
  const query = useQuery()

  const UNMOUNTED = 'unmounted'
  const NOT_FOUND = 'Not found';
  const logReason = (reason: any) => reason === UNMOUNTED || console.log('[ reason ]', reason);

  const loadNgsData = () => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; logReason(reason) });

    const setState = (data: any) => {
      if (data === NOT_FOUND) return history.push('/not-found')
      return canceled || setNgs(data);
    }

    if (!canceled) {
      const ModelID = query.get("Model_ID") as string;

      getNgsDetails(ModelID, filters)
        .then(success => canceled || success.data)
        .then(success => canceled || !success || setState(success))
        .catch(cancel)
        .finally(() => canceled || togglePreloader(false))
    }

    return cancel;
  }

  useEffect(() => {
    const cancel = loadNgsData();
    return () => { cancel(UNMOUNTED) }
  }, []); // eslint-disable-line


  return (
    <>
      {preloader && <Preloader />}
      {!preloader && ngs && (
        <div className="ngs-mutations">
          <div className="ngs-mutations__title">
            <span>Gene symbols</span>
            <InfoIcon title="Indicates the genes found for this model inside any of the 4 NGS data sets - DNA, RNA, CNV, Fusions. More NGS data available via export." />
          </div>
          <div className="ngs-mutations__tags">
            {ngs.genes.length > 0 && ngs.genes.map((value, index) => (
              <div className="ngs-mutations__tag" key={index}>
                <GeneIcon />
                <span>{value}</span>
              </div>
            ))}
            {ngs.aliases.length > 0 && ngs.aliases.map((value, index) => (
              <div className="ngs-mutations__tag" key={index}>
                <GeneAliasIcon />
                <span>{value}</span>
              </div>
            ))}
            {ngs.proteins.length > 0 && ngs.proteins.map((value, index) => (
              <div className="ngs-mutations__tag" key={index}>
                <ProteinIcon />
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MutationsList;
