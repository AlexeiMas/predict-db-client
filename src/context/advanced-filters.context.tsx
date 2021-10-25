import React from 'react';
type BaseArrayOfStrings = string[]

export interface GeneTypeInterface {
  aliases: BaseArrayOfStrings;
  proteins: BaseArrayOfStrings;
  genes: BaseArrayOfStrings;
  includeExpressions?: IncludeExpressions;
}

export interface HistoryTypeInterface {
  treatment: BaseArrayOfStrings;
  response: BaseArrayOfStrings;
}

export interface ResponseTypeInterface {
  treatment: BaseArrayOfStrings;
  response: BaseArrayOfStrings;
}

export interface TumourTypeInterface {
  primary: BaseArrayOfStrings;
  sub: BaseArrayOfStrings;
}

export type ValueType = string | null | undefined
export type GeneType = GeneTypeInterface;
export type TumourType = TumourTypeInterface[]
export type ResponsesType = ResponseTypeInterface[]
export type HistoryType = HistoryTypeInterface[]
export type ModelType = BaseArrayOfStrings;
export type DataAvailable = BaseArrayOfStrings
export type IncludeExpressions = boolean;

interface State {
  tumourType: TumourType;
  responsesType: ResponsesType;
  historyType: HistoryType;
  geneType: GeneType;
  modelType: ModelType;
  dataAvailable: DataAvailable;
  includeExpressions: IncludeExpressions;
}

interface AdvancedFiltersContextInterface {
  geneType: string;
  setGeneTypeAsString: (value: ValueType) => void;

  modelType: string;
  setModelTypeAsString: (value: ValueType) => void;

  tumourType: string;
  setTumourTypeAsString: (value: ValueType) => void;

  historyType: string;
  setHistoryTypeAsString: (value: ValueType) => void;

  responsesType: string;
  setResponsesTypeAsString: (value: ValueType) => void;

  dataAvailable: string;
  setDataAvailableAsString: (value: ValueType) => void;

  hasAdvanced: boolean;
  advancedFilters: State;
  updateAdvancedFilters: (updated: State) => void;
  clearAdvancedFilters: () => void;
}


const AdvancedFiltersContext = React.createContext({})
const { Provider } = AdvancedFiltersContext;

export const useAdvancedFiltersContext = () => {
  const context = React.useContext(AdvancedFiltersContext) as AdvancedFiltersContextInterface;
  if (!context) throw new Error("context used outside of provider");
  return context;
}

const INITIAL_STATE: State = {
  tumourType: [{ primary: [], sub: [] }],
  responsesType: [{ treatment: [], response: [] }],
  historyType: [{ treatment: [], response: [] }],
  geneType: { genes: [], aliases: [], proteins: [], includeExpressions: false },
  modelType: [],
  dataAvailable: [],
  includeExpressions: false,
}

const useProviderHook = (): AdvancedFiltersContextInterface => {
  const [advancedFilters, setAdvancedFilters] = React.useState(INITIAL_STATE)
  const [hasAdvanced, setHasAdvanced] = React.useState(false)

  const [geneType, setGeneType] = React.useState("")
  const [modelType, setModelType] = React.useState("")
  const [tumourType, setTumourType] = React.useState("")
  const [historyType, setHistoryType] = React.useState("")
  const [responsesType, setResponsesType] = React.useState("")
  const [dataAvailable, setDataAvailable] = React.useState("")

  const setGeneTypeAsString = (value: ValueType) => { setGeneType(value || '') }
  const setModelTypeAsString = (value: ValueType) => { setModelType(value || '') }
  const setTumourTypeAsString = (value: ValueType) => { setTumourType(value || '') }
  const setHistoryTypeAsString = (value: ValueType) => { setHistoryType(value || '') }
  const setResponsesTypeAsString = (value: ValueType) => { setResponsesType(value || '') }
  const setDataAvailableAsString = (value: ValueType) => { setDataAvailable(value || '') }

  const updateAdvancedFilters = (updated: State) => {
    setHasAdvanced(true)
    setAdvancedFilters(updated)
  }

  const clearAdvancedFilters = () => {
    setHasAdvanced(false)
    setGeneType('')
    setModelType('')
    setTumourType('')
    setHistoryType('')
    setResponsesType('')
    setDataAvailable('')
    setAdvancedFilters(INITIAL_STATE)
  }


  return {
    geneType,
    setGeneTypeAsString,

    modelType,
    setModelTypeAsString,

    tumourType,
    setTumourTypeAsString,

    historyType,
    setHistoryTypeAsString,

    responsesType,
    setResponsesTypeAsString,

    dataAvailable,
    setDataAvailableAsString,

    hasAdvanced,
    advancedFilters,
    updateAdvancedFilters,
    clearAdvancedFilters,
  }
}


export const AdvancedFiltersProvider = (({ ...rest }) => {
  return (
    <Provider value={useProviderHook()}>
      {rest.children}
    </Provider>
  )
})