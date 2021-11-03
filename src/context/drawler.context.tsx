import React from 'react';
import { FilterModel } from 'shared/models';
import { ClinicalSampleModel } from 'shared/models/clinical-sample.model';

interface StateInterface {
  filters: FilterModel;
  selectedElement: ClinicalSampleModel
  records: ClinicalSampleModel[]
}

interface ControlsInterface {
  updateSelectedElement: (selectedElement: ClinicalSampleModel) => void;
  updateFilters: (filters: FilterModel) => void;
  updateRecords: (records: ClinicalSampleModel[]) => void;
}

interface DrawlerContextInterface {
  state: StateInterface
  controls: ControlsInterface
}

const DrawlerContext = React.createContext({} as DrawlerContextInterface)

const { Provider } = DrawlerContext;

export const useDrawlerCtx = () => {
  const context = React.useContext(DrawlerContext);
  if (!context) throw new Error('context used outside of provider')
  return context;
}

const useValueHook = (): DrawlerContextInterface => {
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

export const DrawlerContextProvider = (({ ...rest }) => {
  return (
    <Provider value={useValueHook()}>
      {rest.children}
    </Provider>
  )
})