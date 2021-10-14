import React from 'react'
import * as ReactFom from 'react-dom';
import * as MCore from "@material-ui/core";
import style from './ManualFilters.module.scss'
import * as Icons from '../../../../assets/images';
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";
import * as filtersApi from "../../../../api/filter.api";
import CustomCheckbox from "shared/components/CustomCheckbox";

export type Name = "Tumour Type" | "Patient Treatment History" | "PDC Model Treatment Response" | "Model ID" | "Data Available" | "Genes"
export const VALUES = ['NGS', 'Patient Treatment History', 'Growth Characteristics', 'Plasma', 'PBMC', 'PDC Model Treatment Response']

export const TEST_DATA = {
  genes: ['TAZ', 'LTA', 'WIZ', 'DPT', 'DST', 'EMD', 'MAK', 'NIN', 'NNT'].join(','),
  modelIDS: ["PTX-0022", "PTX-0023", "PTX-0024", "PTX-0025", "PTX-0026"].join(','),
  dataAvailable: VALUES.join(', '),
  tumourType: [
    "Acanthoma", "Acrospiroma", "ACTH-Secreting Pituitary Adenoma", "Adamantinoma",
    "Apudoma", "Adenoma", "Acanthoma", "Angiomyoma", "Adenomyoma",].join(',')
}
console.log(JSON.stringify({ TEST_DATA }, null, 2));

const CLOSE_MODAL = {
  name: 'CLOSE_MODAL',
  event: new Event('CLOSE_MODAL')
}

const DISPLAY_NAME = 'MANUAL_FILTERS'
const INITIAL_STATE = {
  "Genes": [],
  "Model ID": [],
  "Tumour Type": [],
  "Data Available": [],
  "Patient Treatment History": [],
  "PDC Model Treatment Response": [],
}

const CloseBtn = (({ ...rest }) => (<Icons.CloseIcon height={24} width={24} onClick={rest.onClose} className={style.closeIcon} />))

const RNAExpressionForFilters = (({ ...rest }) => {
  return (
    <label className={style.checkboxLabel}>
      <div className="include-expressions__label">
        Enable RNA expression for filters
        <InfoIcon
          height={28} width={28}
          title="Include expressions (RNA) data in your filters, off by default.
            Exporting data can take some time. Whilst we have broad coverage of most protein-coding genes,
            some genes may be absent in results due to low expression levels."
        />
      </div>
      <CustomCheckbox
        checked={rest.includeExpressions}
        onChange={rest.toggleIncludeExpressions}
      />
    </label>
  )
})

const TextAreaLikeInput = (({ ...rest }) => {
  const name = rest.name.trim();
  const labelText = rest.labelText.trim();
  return (
    <label htmlFor={name}>
      <textarea name={name} id={name} onChange={rest.onChange} placeholder={labelText} value={rest.value} />
    </label>
  )
})

interface GeneInterface { proteins: string[]; aliases: string[]; genes: string[]; }
interface TumourInterface { primary: string[]; sub: string[]; }
interface ResponsesInterface { treatment: string[]; response: string[]; }
interface HistoryInterface { treatment: string[]; response: string[]; }
type ModelType = string[];
type DataAvailableType = string[];

const ManuallyFiltersForm = (({ ...rest }) => {
  if (("setFilters" in rest) === false) throw new Error("[ManuallyFiltersForm] setFilters is required");
  if (("filters" in rest) === false) throw new Error("[ManuallyFiltersForm] filters is required");
  if (("isClearFilter" in rest) === false) throw new Error("[ManuallyFiltersForm] isClearFilter is required");
  if (("setIsClearFilter" in rest) === false) throw new Error("[ManuallyFiltersForm] setIsClearFilter is required");

  const formRef = React.useRef<HTMLFormElement>(null)
  const [state, setState] = React.useState(INITIAL_STATE)

  const uniq = (acc: string[], value: string) => [...acc, ...(acc.includes(value) ? [] : [value])]

  const [tumourType, setTumourType] = React.useState({ primary: [], sub: [] } as TumourInterface)
  const [responsesType, setResponsesType] = React.useState({ treatment: [], response: [] } as ResponsesInterface)
  const [historyType, setHistoryType] = React.useState({ treatment: [], response: [] } as HistoryInterface)
  const [geneType, setGeneType] = React.useState({ genes: [], aliases: [], proteins: [], } as GeneInterface);
  const [modelType, setModelType] = React.useState([] as ModelType);
  const [dataAvailable, setDataAvailable] = React.useState([] as DataAvailableType);
  const [includeExpressions, setIncludeExpressions] = React.useState(false)


  const closeModal = () => {
    setState(INITIAL_STATE)
    rest.controls.hide()
  }

  const prepare = (data: string[]): string[] => {
    const flattened = [data].flat(Infinity) as string[];
    return flattened.map(i => i.trim()).filter(Boolean);
  }

  const processDataAvailable = (search: string[]) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const prepared = prepare(search);
    const comparators = prepared.map((i: string) => new RegExp(i, 'gi'))
    const preparedToCompare = search.map(i => i.trim().toLowerCase())
    const processDataAvailableResponseData = (data: any) => {
      const processed = data.filter((i: string) => preparedToCompare.includes(i.trim().toLowerCase())).reduce(uniq, [])
      console.log(JSON.stringify({ modelType: processed }, null, 2));
      setDataAvailable(processed)
    }
    if (!canceled) {
      Promise.resolve({ data: VALUES.filter(i => search.some(s => s.charAt(0).toLowerCase() === i.charAt(0).toLowerCase()) && comparators.some(c => c.test(i))) })
        .then(success => canceled || success.data || rejectNoDataResponse())
        .then(processDataAvailableResponseData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processDataAvailable.name))
    }
    return cancel;
  }

  const processGenes = (value: string[]) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const processGenesResponseData = (data: GeneInterface) => {
      const processed = Object.entries(data).reduce(
        (acc, [key, value]) => {
          const type = key as 'genes' | 'proteins' | 'aliases'
          const res = value as string[]
          if (['genes', 'proteins', 'aliases'].includes(type) && res.length) {
            acc[type] = [...res, ...acc[type]].reduce(uniq, []) as string[];
          }
          return acc;
        },
        { genes: [], proteins: [], aliases: [] } as GeneInterface
      )

      setGeneType(processed)
    }
    if (!canceled) {
      filtersApi.getGeneFilteredDataByArray({ search: value, strictEqual: true })
        .then(success => canceled || success.data || rejectNoDataResponse())
        .then(processGenesResponseData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processGenes.name))
    }
    return cancel;
  }


  const rejectNoDataResponse = (() => Promise.reject(new Error("No data in search response")));

  const processModelID = (search: string[]) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const preparedToCompare = search.map(i => i.trim().toLowerCase())
    const processModelIDSResponseData = (data: any) => {
      const processed = data.filter((i: string) => preparedToCompare.includes(i.trim().toLowerCase())).reduce(uniq, [])
      console.log(JSON.stringify({ modelType: processed }, null, 2));
      setModelType(processed)
    }
    if (!canceled) {
      filtersApi.getModelFilteredDataByArray(search)
        .then(success => canceled || success.data || rejectNoDataResponse())
        .then(processModelIDSResponseData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processModelID.name))
    }

    return cancel
  }



  const processPDCModelTreatmentResponse = (search: string[]) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const preparedToCompare = search.map(i => i.trim().toLowerCase())
    const processFiltersResponseTypeData = (data: any) => {
      const processed = Object.keys(data).reduce(
        (acc, key) => {
          const type = key as 'treatment' | 'response'
          const valueArray = data[type] as string[];
          acc[type] = [...acc[type], ...valueArray.filter(i => preparedToCompare.includes(i.trim().toLowerCase()))].reduce(uniq, [])
          return acc;
        },
        { response: [], treatment: [] } as ResponsesInterface
      )
      console.log(JSON.stringify({ responsesType: [processed] }, null, 2));
      setResponsesType(processed)
    }

    if (!canceled) {
      const responsesPromise = filtersApi.getFilteredDataByArray('responses', 'response', search, undefined);
      const treatmentPromise = filtersApi.getFilteredDataByArray('responses', 'treatment', search, undefined);
      Promise.all([responsesPromise, treatmentPromise])
        .then(success => canceled || success.map(i => i.data) || rejectNoDataResponse())
        .then((success: any) => ({ response: success[0], treatment: success[1] }))
        .then(processFiltersResponseTypeData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processPDCModelTreatmentResponse.name))
    }

    return cancel;
  }

  const processPatientTreatmentHistory = (search: string[]) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const preparedToCompare = search.map(i => i.trim().toLowerCase())
    const processFiltersHistoryTypeData = (data: any) => {
      const processed = Object.keys(data).reduce(
        (acc, key) => {
          const type = key as 'treatment' | 'response'
          const valueArray = data[type] as string[];
          acc[type] = [...acc[type], ...valueArray.filter(i => preparedToCompare.includes(i.trim().toLowerCase()))].reduce(uniq, [])
          return acc;
        },
        { response: [], treatment: [] } as HistoryInterface
      )
      console.log(JSON.stringify({ historyType: [processed] }, null, 2));
      setHistoryType(processed)
    }

    if (!canceled) {
      const responsesPromise = filtersApi.getFilteredDataByArray('history', 'response', search, undefined);
      const treatmentPromise = filtersApi.getFilteredDataByArray('history', 'treatment', search, undefined);
      Promise.all([responsesPromise, treatmentPromise])
        .then(success => canceled || success.map(i => i.data) || rejectNoDataResponse())
        .then((success: any) => ({ response: success[0], treatment: success[1] }))
        .then(processFiltersHistoryTypeData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processPDCModelTreatmentResponse.name))
    }
    return cancel
  }

  const processTumourType = (search: string[]) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const preparedToCompare = search.map(i => i.trim().toLowerCase())

    const processTumourTypeResponseData = (data: { primary: string[], sub: string[] }) => {
      const processed = Object.entries(data).reduce(
        (acc, [key, value]) => {
          const valueArray = value as string[];
          const keyToAcc = key as "sub" | "primary";
          acc[keyToAcc] = [...acc[keyToAcc], ...valueArray.filter(i => preparedToCompare.includes(i.trim().toLowerCase()))].reduce(uniq, [])
          return acc;
        },
        { primary: [], sub: [] } as { primary: string[], sub: string[] }
      )
      console.log(JSON.stringify({ tumourType: [processed] }, null, 2));
      setTumourType(processed)
    }
    if (!canceled) {
      filtersApi.getFilteredTumoursPSMixedByArray({ search })
        .then((success: any) => canceled || success.data || rejectNoDataResponse())
        .then(processTumourTypeResponseData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processTumourType.name))
    }
    return cancel
  }

  const processors = {
    "Genes": MCore.debounce(processGenes, 350),
    "Model ID": MCore.debounce(processModelID, 350),
    "Tumour Type": MCore.debounce(processTumourType, 350),
    "Data Available": MCore.debounce(processDataAvailable, 350),
    "Patient Treatment History": MCore.debounce(processPatientTreatmentHistory, 350),
    "PDC Model Treatment Response": MCore.debounce(processPDCModelTreatmentResponse, 350),
  }

  const updateState = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name.trim() as Name;
    const value = e.target.value.slice().replace(/,/gi, '\n');
    const spitted = value.split('\n');
    if ((name in state) === false) throw new Error("Unknown state key: " + name);
    if ((name in processors) === false) throw new Error("Unknown processors key: " + name);
    const updated = { ...state, [name]: spitted.join('\n') }
    setState(updated)
    processors[name](spitted)
  }

  const handlePreventDefault = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const updateFilters = () => {
    const updatedFilters = {
      ...rest.filters,
      tumourType: [tumourType],
      responsesType: [responsesType],
      historyType: [historyType],
      geneType: { ...geneType, includeExpressions },
      modelType: [...modelType],
      dataAvailable: [...dataAvailable],
      includeExpressions
    }
    rest.setFilters(updatedFilters)
  }

  const handleClick = () => {
    let canceled = false;
    const cancel = ((error: any) => { canceled = true; console.log('[ error ]', error); })

    if (!canceled) {
      Promise.resolve()
        .then(() => canceled || updateFilters())
        .catch(cancel)
        .finally(closeModal)
    }
    return cancel;
  }

  React.useEffect(() => {
    document.body.addEventListener(CLOSE_MODAL.name, handleClick);
    return () => { document.body.removeEventListener(CLOSE_MODAL.name, handleClick); };
  });

  return (
    <div className={style.formContainer}>
      <form ref={formRef} name={ManuallyFiltersForm.name} id={ManuallyFiltersForm.name} onSubmit={handlePreventDefault}>
        <TextAreaLikeInput value={state["Tumour Type"]} onChange={updateState} name="Tumour Type" labelText="Tumour Type" />
        <TextAreaLikeInput value={state["Patient Treatment History"]} onChange={updateState} name="Patient Treatment History" labelText="Patient Treatment History" />
        <TextAreaLikeInput value={state["PDC Model Treatment Response"]} onChange={updateState} name="PDC Model Treatment Response" labelText="PDC Model Treatment Response" />
        <TextAreaLikeInput value={state["Model ID"]} onChange={updateState} name="Model ID" labelText="Model ID" />
        <TextAreaLikeInput value={state["Data Available"]} onChange={updateState} name="Data Available" labelText="Data Available" />
        <TextAreaLikeInput value={state["Genes"]} onChange={updateState} name="Genes" labelText="Genes" />
        <RNAExpressionForFilters includeExpressions={includeExpressions} toggleIncludeExpressions={() => setIncludeExpressions(!includeExpressions)} />
        <div className={style.formControls}>
          <button type="button" onClick={handleClick}>Apply</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  )
})

export const ManualFilters = (({ ...rest }): JSX.Element => {
  const [visible, setVisible] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null)
  const targetElement = (rest.target || document.body) as HTMLElement;

  const show = () => setVisible(true)
  const hide = () => setVisible(false)
  const toggle = () => setVisible(!visible)

  const debouncedShow = MCore.debounce(() => setVisible(true), 300) /* eslint-disable-line */
  const debouncedHide = MCore.debounce(() => setVisible(false), 300) /* eslint-disable-line */
  const debouncedToggle = MCore.debounce(() => setVisible(!visible), 300) /* eslint-disable-line */


  React.useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!contentRef.current) return;
      if (!e.target.contains(contentRef.current)) return
      document.body.dispatchEvent(CLOSE_MODAL.event);
      debouncedHide()
    }

    targetElement.addEventListener('click', handleClickOutside)
    return () => {
      targetElement.removeEventListener('click', handleClickOutside)
    }
  })

  return (
    <div id={DISPLAY_NAME}>
      <div >
        <button
          style={{ backgroundColor: '#0941AC', color: "white", borderColor: 'transparent', marginLeft: 10 }}
          className="btn btn-outlined search__filter-btn"
          onClick={toggle}
        >
          <Icons.FilterIcon height={24} width={24} />
          <span>Advanced&nbsp;Filters</span>
        </button>
      </div>
      {
        visible && ReactFom.createPortal(
          (
            <div id="ME" ref={contentRef} className={style.container} >
              <div className={style.content}>
                <div className={style.top}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Advanced&nbsp;Filters&nbsp;
                    <InfoIcon height={28} width={28} title='You can enter a list of entries, separated by a newline into each filter input' />
                  </div>
                  <CloseBtn onClose={hide} />
                </div>
                <div className={style.center}>
                  <ManuallyFiltersForm {...rest} controls={{ show, hide, toggle, debouncedShow, debouncedToggle, debouncedHide }} />
                </div>
              </div>
            </div>
          ),
          targetElement
        )
      }
    </div>
  )
})