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
  const EMPTY = '';
  const [advancedFilters, setAdvancedFilters] = React.useState(INITIAL_STATE)
  const [hasAdvanced, setHasAdvanced] = React.useState(false)

  const [geneType, setGeneType] = React.useState(EMPTY.trim())
  const [modelType, setModelType] = React.useState(EMPTY.trim())
  const [tumourType, setTumourType] = React.useState(EMPTY.trim())
  const [historyType, setHistoryType] = React.useState(EMPTY.trim())
  const [responsesType, setResponsesType] = React.useState(EMPTY.trim())
  const [dataAvailable, setDataAvailable] = React.useState(EMPTY.trim())

  const setGeneTypeAsString = (value: ValueType) => { setGeneType(value || EMPTY.trim()) }
  const setModelTypeAsString = (value: ValueType) => { setModelType(value || EMPTY.trim()) }
  const setTumourTypeAsString = (value: ValueType) => { setTumourType(value || EMPTY.trim()) }
  const setHistoryTypeAsString = (value: ValueType) => { setHistoryType(value || EMPTY.trim()) }
  const setResponsesTypeAsString = (value: ValueType) => { setResponsesType(value || EMPTY.trim()) }
  const setDataAvailableAsString = (value: ValueType) => { setDataAvailable(value || EMPTY.trim()) }

  const updateAdvancedFilters = (updated: State) => { setAdvancedFilters(updated) }

  const clearAdvancedFilters = () => {
    setGeneType(EMPTY.trim())
    setModelType(EMPTY.trim())
    setTumourType(EMPTY.trim())
    setHistoryType(EMPTY.trim())
    setResponsesType(EMPTY.trim())
    setDataAvailable(EMPTY.trim())
    setAdvancedFilters(INITIAL_STATE)
  }

  const watchHasAdvanced = () => {
    let canceled = false;
    const cancel = (() => { canceled = true; })

    Promise.resolve()
      .then(() => {
        const initialStateClone = JSON.stringify(INITIAL_STATE);
        const advancedFiltersClone = JSON.stringify(advancedFilters);
        const filtersStateNotEqualToInitial = advancedFiltersClone.length !== initialStateClone.length;

        const all = [geneType, modelType, tumourType, historyType, responsesType, dataAvailable].join(EMPTY.trim());
        const allSizeGreaterThanZero = all.trim().length !== EMPTY.trim().length;
        const isHasAdvanced = allSizeGreaterThanZero || filtersStateNotEqualToInitial;
        return isHasAdvanced;
      })
      .then((isHasAdvanced) => canceled || setHasAdvanced(isHasAdvanced))
      .catch(cancel)

    return cancel;
  }

  React.useEffect(() => { const cancel = watchHasAdvanced(); return () => { cancel(); }; });

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