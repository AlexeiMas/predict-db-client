import React from 'react'
import style from './AdvancedFilters.module.scss'
import * as filtersApi from "../../../../api/filter.api";
import { RNAExpressionForFilters } from './RNAExpressionForFilters';
import { TextAreaLikeInput } from './TextAreaLikeInput';
import { TEST_DATA } from './test-data'
import { useAdvancedFiltersContext, ResponseTypeInterface, HistoryTypeInterface, GeneTypeInterface } from '../../../../context/advanced-filters.context';
console.log(JSON.stringify({ TEST_DATA }, null, 2));

export const VALUES = ['NGS', 'Patient Treatment History', 'Growth Characteristics', 'Plasma', 'PBMC', 'PDC Model Treatment Response']


type Name = "tumourType" | "responsesType" | "historyType" | "geneType" | "modelType" | "dataAvailable";
const CLOSE_MODAL = {
  name: 'CLOSE_MODAL',
  event: new Event('CLOSE_MODAL')
}

export const NAME_PLACEHOLDERS_MAP = {
  tumourType: "Tumour Type",
  responsesType: "PDC Model Treatment Response",
  historyType: "Patient Treatment History",
  geneType: "Genes",
  modelType: "Model ID",
  dataAvailable: "Data Available",
  includeExpressions: "Enable RNA",
}

export const AdvancedFiltersForm = (({ ...rest }) => {
  if (("setFilters" in rest) === false) throw new Error("[AdvancedFiltersForm] setFilters is required");
  if (("filters" in rest) === false) throw new Error("[AdvancedFiltersForm] filters is required");
  if (("isClearFilter" in rest) === false) throw new Error("[AdvancedFiltersForm] isClearFilter is required");
  if (("setIsClearFilter" in rest) === false) throw new Error("[AdvancedFiltersForm] setIsClearFilter is required");

  const context = useAdvancedFiltersContext();

  const uniq = (acc: string[], value: string) => [...acc, ...(acc.includes(value) ? [] : [value])]
  const rejectNoDataResponse = (() => Promise.reject(new Error("No data in search response")));
  const handlePreventDefault = (e: React.ChangeEvent<HTMLFormElement>) => { e.preventDefault() }

  const processTumourType = (search: string[], name: Name) => {
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
      const updated = { ...context.advancedFilters, [name]: [processed] }
      context.updateAdvancedFilters(updated)
    }
    if (!canceled) {
      filtersApi.getFilteredTumoursPSMixedByArray({ search })
        .then((success: any) => canceled || success.data || rejectNoDataResponse())
        .then(processTumourTypeResponseData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processTumourType.name))
    }
    return cancel;
  }

  const processResponsesType = (search: string[], name: Name) => {
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
        { response: [], treatment: [] } as ResponseTypeInterface
      )
      const updated = { ...context.advancedFilters, [name]: [processed] }
      context.updateAdvancedFilters(updated)
    }

    if (!canceled) {
      const responsesPromise = filtersApi.getFilteredDataByArray('responses', 'response', search, undefined);
      const treatmentPromise = filtersApi.getFilteredDataByArray('responses', 'treatment', search, undefined);
      Promise.all([responsesPromise, treatmentPromise])
        .then(success => canceled || success.map(i => i.data) || rejectNoDataResponse())
        .then((success: any) => ({ response: success[0], treatment: success[1] }))
        .then(processFiltersResponseTypeData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processResponsesType.name))
    }

    return cancel;
  }

  const processHistoryType = (search: string[], name: Name) => {
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
        { response: [], treatment: [] } as HistoryTypeInterface
      )
      const updated = { ...context.advancedFilters, [name]: [processed] }
      context.updateAdvancedFilters(updated)
    }

    if (!canceled) {
      const responsesPromise = filtersApi.getFilteredDataByArray('history', 'response', search, undefined);
      const treatmentPromise = filtersApi.getFilteredDataByArray('history', 'treatment', search, undefined);
      Promise.all([responsesPromise, treatmentPromise])
        .then(success => canceled || success.map(i => i.data) || rejectNoDataResponse())
        .then((success: any) => ({ response: success[0], treatment: success[1] }))
        .then(processFiltersHistoryTypeData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processHistoryType.name))
    }
    return cancel;
  }

  const processGeneType = (search: string[], name: Name) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const processGenesResponseData = (data: GeneTypeInterface) => {
      const processed = Object.entries(data).reduce(
        (acc, [key, value]) => {
          const type = key as 'genes' | 'proteins' | 'aliases'
          const res = value as string[]
          if (['genes', 'proteins', 'aliases'].includes(type) && res.length) {
            acc[type] = [...res, ...acc[type]].reduce(uniq, []) as string[];
          }
          return acc;
        },
        { genes: [], proteins: [], aliases: [] } as GeneTypeInterface
      )
      const updated = { ...context.advancedFilters, geneType: { ...context.advancedFilters.geneType, ...processed } }
      context.updateAdvancedFilters(updated)
    }
    if (!canceled) {
      filtersApi.getGeneFilteredDataByArray({ search, strictEqual: true })
        .then(success => canceled || success.data || rejectNoDataResponse())
        .then(processGenesResponseData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processGeneType.name))
    }

    return cancel;
  }

  const processModelType = (search: string[], name: Name) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const preparedToCompare = search.map(i => i.trim().toLowerCase())
    const processModelIDSResponseData = (data: any) => {
      const processed = data.filter((i: string) => preparedToCompare.includes(i.trim().toLowerCase())).reduce(uniq, [])
      const updated = { ...context.advancedFilters, [name]: processed }
      context.updateAdvancedFilters(updated)
    }
    if (!canceled) {
      filtersApi.getModelFilteredDataByArray(search)
        .then(success => canceled || success.data || rejectNoDataResponse())
        .then(processModelIDSResponseData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processModelType.name))
    }

    return cancel;
  }

  const prepare = (data: string[]): string[] => {
    const flattened = [data].flat(Infinity) as string[];
    return flattened.map(i => i.trim()).filter(Boolean);
  }

  const processDataAvailable = (search: string[], name: Name) => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    const prepared = prepare(search);
    const comparators = prepared.map((i: string) => new RegExp(i, 'gi'))
    const preparedToCompare = search.map(i => i.trim().toLowerCase())
    const processDataAvailableResponseData = (data: any) => {
      const processed = data.filter((i: string) => preparedToCompare.includes(i.trim().toLowerCase())).reduce(uniq, [])
      const updated = { ...context.advancedFilters, [name]: processed }
      context.updateAdvancedFilters(updated)
    }
    if (!canceled) {
      const someHandler = (i: string) => (s: string) => s.charAt(0).toLowerCase() === i.charAt(0).toLowerCase();
      Promise.resolve({ data: VALUES.filter(i => prepared.some(someHandler(i)) && comparators.some(c => c.test(i))) })
        .then(success => canceled || success.data || rejectNoDataResponse())
        .then(processDataAvailableResponseData)
        .catch(cancel)
        .finally(() => canceled || console.log('[ finished ] ::' + processDataAvailable.name))
    }
    return cancel;
  }

  const processors = {
    tumourType: processTumourType,
    responsesType: processResponsesType,
    historyType: processHistoryType,
    geneType: processGeneType,
    modelType: processModelType,
    dataAvailable: processDataAvailable,
  }


  const updateState = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = e.target.name.trim() as Name;
    const value = e.target.value.slice().replace(/,/gi, '\n');
    const spitted = value.split('\n');
    if ((name in context.advancedFilters) === false) throw new Error("Unknown advancedFilters key: " + name);
    if ((name in processors) === false) throw new Error("Unknown processors key: " + name);
    processors[name](spitted, name)


    switch (name) {
      case "modelType":
        context.setModelTypeAsString(spitted.join('\n'))
        break;
      case "tumourType":
        context.setTumourTypeAsString(spitted.join('\n'))
        break;
      case "geneType":
        context.setGeneTypeAsString(spitted.join('\n'))
        break;
      case "historyType":
        context.setHistoryTypeAsString(spitted.join('\n'))
        break;
      case "responsesType":
        context.setResponsesTypeAsString(spitted.join('\n'))
        break;
      case "dataAvailable":
        context.setDataAvailableAsString(spitted.join('\n'))
        break;
      default:
        break;
    }
  }

  const toggleIncludeExpressions = () => {
    const updated = {
      ...context.advancedFilters,
      includeExpressions: !context.advancedFilters.includeExpressions,
      geneType: { ...context.advancedFilters.geneType, includeExpressions: !context.advancedFilters.includeExpressions, }
    }
    context.updateAdvancedFilters(updated)
  }

  const updateFilters = () => {
    const isNotEquals = JSON.stringify(context.advancedFilters) !== JSON.stringify(rest.filters)
    if (isNotEquals) rest.setFilters({ ...context.advancedFilters })
  }
  const closeModal = () => rest.controls.hide()
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
  }, []); /* eslint-disable-line */

  const handleEscape = (e: KeyboardEvent) => /escape/gi.test(e.code) === false || handleClick()
  React.useEffect(() => {
    window.addEventListener('keydown', handleEscape);
    return () => { window.removeEventListener('keydown', handleEscape); };
  }, []); /* eslint-disable-line */



  return (
    <div className={style.formContainer}>
      <form name={AdvancedFiltersForm.name} id={AdvancedFiltersForm.name} onSubmit={handlePreventDefault}>
        <TextAreaLikeInput onChange={updateState} name="tumourType" />
        <TextAreaLikeInput onChange={updateState} name="historyType" />
        <TextAreaLikeInput onChange={updateState} name="responsesType" />
        <TextAreaLikeInput onChange={updateState} name="modelType" />
        <TextAreaLikeInput onChange={updateState} name="dataAvailable" />
        <TextAreaLikeInput onChange={updateState} name="geneType" />
        <RNAExpressionForFilters includeExpressions={context.advancedFilters.includeExpressions} toggleIncludeExpressions={toggleIncludeExpressions} />
        <div className={style.formControls}>
          <button type="button" onClick={handleClick}>Apply</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  )
})