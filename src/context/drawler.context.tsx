import React from 'react';
import { FilterModel } from 'shared/models';
import { ClinicalSampleModel } from 'shared/models/clinical-sample.model';

type StateInterface = {
  filters: FilterModel;
  selectedElement: ClinicalSampleModel
  records: ClinicalSampleModel[]
}

type ControlsInterface = {
  updateSelectedElement: (selectedElement: ClinicalSampleModel) => void;
  updateFilters: (filters: FilterModel) => void;
  updateRecords: (records: ClinicalSampleModel[]) => void;
}

type DrawlerContextInterface = {
  state: StateInterface;
  controls: ControlsInterface;
}

const DrawlerContext = React.createContext({} as DrawlerContextInterface)

export const useDrawlerCtx = () => {
  const context = React.useContext(DrawlerContext);
  if (!context) throw new Error('context used outside of provider')
  return context;
}

const useDrawlerHook = (): DrawlerContextInterface => {
  const [filters, setFilters] = React.useState({} as FilterModel)
  const [selectedElement, setSelectedElement] = React.useState({} as ClinicalSampleModel)
  const [records, setRecords] = React.useState([] as ClinicalSampleModel[]);

  const updateSelectedElement = (element: ClinicalSampleModel) => { setSelectedElement(element) }
  const updateFilters = (data: FilterModel) => { setFilters(data) }
  const updateRecords = (data: ClinicalSampleModel[]) => { setRecords(data) }

  return {
    state: { filters, selectedElement, records },
    controls: { updateSelectedElement, updateFilters, updateRecords }
  }
}

export const Provider = (({ ...rest }) => {
  const { Provider } = DrawlerContext;
  return (<Provider value={useDrawlerHook()}>{rest.children}</Provider>)
})