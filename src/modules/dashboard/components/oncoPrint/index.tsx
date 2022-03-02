import React from 'react';
import OncoPrint from 'react-oncoprint/lib/components/OncoPrint';
import data1 from '../../../../data/dataset1.json'
import data2 from '../../../../data/dataset2.json'
import data3 from '../../../../data/dataset3.json'


const OncoChart = () => {

    const data = [
      {
        sample: 'TCGA-25-2392-01',
        gene: 'TP53',
        alteration: 'FUSION',
        type: 'FUSION',
      },
      {
        sample: 'TCGA-25-2393-01',
        gene: 'TP53',
        alteration: 'FUSION',
        type: 'FUSION',
      },
    ];

    return (
      <div>
        <OncoPrint background={"green"} data={data3}/>
      </div>
    );
}

export default OncoChart;
