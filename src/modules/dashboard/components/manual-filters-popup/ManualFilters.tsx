import React from 'react'
import * as ReactFom from 'react-dom';
import * as MCore from "@material-ui/core";
import style from './ManualFilters.module.scss'
import * as Icons from '../../../../assets/images';
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";
import * as filtersApi from "../../../../api/filter.api";

export type Name = "Tumour Type" | "Patient Treatment History" | "PDS Model Treatment Response" | "Model ID" | "Data Available"
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

const DISPLAY_NAME = 'MANUAL_FILTERS'
const INITIAL_STATE = {
  "Model ID": [],
  "Tumour Type": [],
  "Data Available": [],
  "Patient Treatment History": [],
  "PDS Model Treatment Response": [],
}

const CloseBtn = (({ ...rest }) => (<Icons.CloseIcon height={24} width={24} onClick={rest.onClose} className={style.closeIcon} />))


const TextAreaLikeInput = (({ ...rest }) => {
  const name = rest.name.trim();
  const labelText = rest.labelText.trim();
  return (
    <label htmlFor={name}>
      <textarea name={name} id={name} onChange={rest.onChange} placeholder={labelText} value={rest.value} />
    </label>
  )
})

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
  const [modelType, setModelType] = React.useState([] as ModelType);
  const [dataAvailable, setDataAvailable] = React.useState([] as DataAvailableType);


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



  const processPDSModelTreatmentResponse = (search: string[]) => {
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
        .finally(() => canceled || console.log('[ finished ] ::' + processPDSModelTreatmentResponse.name))
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
        .finally(() => canceled || console.log('[ finished ] ::' + processPDSModelTreatmentResponse.name))
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
    "Model ID": MCore.debounce(processModelID, 350),
    "Tumour Type": MCore.debounce(processTumourType, 350),
    "Data Available": MCore.debounce(processDataAvailable, 350),
    "Patient Treatment History": MCore.debounce(processPatientTreatmentHistory, 350),
    "PDS Model Treatment Response": MCore.debounce(processPDSModelTreatmentResponse, 350),
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

  const handleClick = () => {
    let canceled = false;
    const cancel = ((error: any) => { canceled = true; console.log('[ error ]', error); })
    const updateFilters = () => {
      const updatedFilters = {
        ...rest.filters,
        tumourType: [tumourType],
        responsesType: [responsesType],
        historyType: [historyType],
        modelType: [...modelType],
        dataAvailable: [...dataAvailable],
      }
      rest.setFilters(updatedFilters)
    }
    if (!canceled) {
      Promise.resolve()
        .then(() => canceled || updateFilters())
        .catch(cancel)
        .finally(closeModal)
    }
    return cancel;
  }

  return (
    <div className={style.formContainer}>
      <form ref={formRef} name={ManuallyFiltersForm.name} id={ManuallyFiltersForm.name} onSubmit={handlePreventDefault}>
        <TextAreaLikeInput value={state["Tumour Type"]} onChange={updateState} name="Tumour Type" labelText="Tumour Type" />
        <TextAreaLikeInput value={state["Patient Treatment History"]} onChange={updateState} name="Patient Treatment History" labelText="Patient Treatment History" />
        <TextAreaLikeInput value={state["PDS Model Treatment Response"]} onChange={updateState} name="PDS Model Treatment Response" labelText="PDS Model Treatment Response" />
        <TextAreaLikeInput value={state["Model ID"]} onChange={updateState} name="Model ID" labelText="Model ID" />
        <TextAreaLikeInput value={state["Data Available"]} onChange={updateState} name="Data Available" labelText="Data Available" />
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


  React.useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!contentRef.current) return;
      if (!e.target.contains(contentRef.current)) return
      hide()
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
          <span>Filter&nbsp;manually</span>
        </button>
      </div>
      {
        visible && ReactFom.createPortal(
          (
            <div id="ME" ref={contentRef} className={style.container} >
              <div className={style.content}>
                <div className={style.top}>
                  <div>
                    Filter manually
                    <InfoIcon title='You can enter a list of entries, separated by a newline into each filter input' />
                  </div>
                  <CloseBtn onClose={hide} />
                </div>
                <div className={style.center}>
                  <ManuallyFiltersForm {...rest} controls={{ show, hide, toggle }} />
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