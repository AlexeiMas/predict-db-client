import { ChangeEvent, Dispatch, SetStateAction, useMemo, useState, useEffect } from "react";
import { FilterModel, ResponsesFilterModel } from "../../../../shared/models/filters.model";
import { getFilteredData } from "../../../../api/filter.api";
import { debounce } from "@material-ui/core";
import CloseIcon from "../../../../shared/components/Icons/CloseIcon";
import GreenPlusIcon from "../../../../shared/components/Icons/GreenPlusIcon";
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";
import PlusIcon from "../../../../shared/components/Icons/PlusIcon";
import ArrowDownIcon from "../../../../shared/components/Icons/ArrowDownIcon";
import { ArrowUpIcon } from "../../../../shared/components/Icons";
import Preloader from "../../../../shared/components/Preloader";
import DropdownMenu from "../DropdownMenu";
import { ResponsesFilterSubTypes } from "../../../../shared/types/filter-types";
import * as analytics from '../../../../analytics'

interface ResponsesFilterProps {
  setFilters: Dispatch<SetStateAction<FilterModel>>;
  index: number;
  filters: FilterModel;
  isClearFilter: boolean;
  setIsClearFilter: (state: boolean) => void;
}

/* TODO: Need to refactor this component to use universal functions instead of one-to-one binding each filter mechanic.
*        Design makes this difficult to implement at the beginning according to not consistent logic of filters behaviour.
* */
const ResponsesFilter = ({ filters, setFilters, index, isClearFilter, setIsClearFilter }: ResponsesFilterProps): JSX.Element => {
  const [showTreatmentDropdown, setShowTreatmentDropdown] = useState(false);
  const [showResponseDropdown, setShowResponseDropdown] = useState(false);

  const [preloader, setPreloader] = useState(false);
  const [filterOptions, setFilterOptions] = useState([] as string[]);

  const [treatmentFilter, setTreatmentFilter] = useState([] as string[]);
  const [responseFilter, setResponseFilter] = useState([] as string[]);

  const [canAddNewFilter, setCanAddNewFilter] = useState(false);

  const addNewEmptyFilter = (): void => {
    const requiredFilters = filters.responsesType.filter((el: ResponsesFilterModel) =>
      el.treatment.length === 0 || el.response === null);

    if (!requiredFilters.length) {
      filters.responsesType.push({
        response: [],
        treatment: [],
      });
    }

    setCanAddNewFilter(false);
  }

  const dropdownBgClick = (): void => {
    setShowTreatmentDropdown(false);
    setShowResponseDropdown(false);
  }

  const search = async (value: string, filterType: ResponsesFilterSubTypes, primaryFilter?: string): Promise<void> => {
    try {
      setPreloader(true);
      const { data } = await getFilteredData('responses', filterType, value, primaryFilter);
      setFilterOptions([...data]);
    } catch (e) {
      console.log(e);
    } finally {
      setPreloader(false);
    }
  }

  const loadDefaultOptions = async (filterType: ResponsesFilterSubTypes, query?: string): Promise<void> => {
    try {
      setPreloader(true);
      const { data } = await getFilteredData('responses', filterType, query);
      setFilterOptions(data);
    } catch (e) {
      console.log(e);
    } finally {
      setPreloader(false);
    }
  }

  const searchHandler = useMemo(() => debounce(search, 500), []);

  const calculateMenuPosition = (filterType: string): void => {
    const buttons = document.querySelectorAll<HTMLElement>(`.filter-button-${filterType}`);

    buttons.forEach(button => {
      if (button) {
        const rect = button.getBoundingClientRect();
        const left = rect!.left - 2;
        const top = rect!.bottom + 2;
        const menu = button.parentElement?.querySelector<HTMLElement>(`.filter-menu-${filterType}`);
        menu!.style.top = top + "px";
        menu!.style.left = left + "px";
      }
    });
  };

  const onFilterButtonClick = (filterType: ResponsesFilterSubTypes, query?: string): void => {
    switch (filterType) {
      case 'response':
        setShowResponseDropdown(!showResponseDropdown);
        calculateMenuPosition('response');
        break;
      case 'treatment':
        setShowTreatmentDropdown(!showTreatmentDropdown);
        calculateMenuPosition('treatment');
        break;
    }

    loadDefaultOptions(filterType, query);
  }

  const selectedTreatmentOptions = (): JSX.Element => {
    if (treatmentFilter && treatmentFilter.length) {
      return (<div className="filter-tags">
        { treatmentFilter.map((item: string, index: number) => (
          <div className="filter__tag" data-filter={analytics.GTM_ENV.FILTERS.FILTERS_PDC.name} key={ index }>
            <span>{ item }</span>
            <div className="close-icon">
              <CloseIcon close={ () => removeTreatmentOption(index) }/>
            </div>
          </div>
        ))
        }

        <div className="filter-tags__new-btn" onClick={ () => setShowTreatmentDropdown(true) }>
          <GreenPlusIcon/>
        </div>
      </div>)
    }

    return <></>
  }

  const selectedResponseOptions = (): JSX.Element => {
    if (responseFilter && responseFilter.length) {
      return (<div className="filter-tags">
        { responseFilter.map((item: string, index: number) => (
          <div className={"filter__tag " + responseBoxClass(item)} data-filter={analytics.GTM_ENV.FILTERS.FILTERS_PDC_RESPONSE_TYPE.name} key={ index }>
            <span>{ item }</span>
            <div className="close-icon">
              <CloseIcon close={ () => removeResponseOption(index) }/>
            </div>
          </div>
        ))
        }

        <div className="filter-tags__new-btn" onClick={ () => setShowResponseDropdown(true) }>
          <GreenPlusIcon/>
        </div>
      </div>)
    }

    return <></>
  }

  const canShowTreatmentFilter = (): boolean => {
    return !!(treatmentFilter && treatmentFilter.length)
  }

  const canShowResponseFilter = (): boolean => {
    return !!(responseFilter && responseFilter.length)
  }

  const responseBoxClass = (value: string): string => {
      switch (value) {
        case 'Positive':
          return 'positive-box';
        case 'Negative':
          return 'negative-box';
        case 'Intermediate':
          return 'intermediate-box';
        default:
          return '';
      }
  }

  // Methods of working with filters
  const selectTreatmentOption = (option: string) => {
    const newTreatment = [...treatmentFilter];

    if (newTreatment.includes(option)) return;

    newTreatment.push(option);
    setTreatmentFilter(newTreatment);
    setResponseFilter([]);
  }

  const removeTreatmentOption = (index: number): void => {
    const newFilters = [...treatmentFilter];
    newFilters.splice(index, 1);
    setTreatmentFilter(newFilters);
    setResponseFilter([]);
  }

  const selectResponseOption = (option: string): void => {
    const newResponse = [...responseFilter];

    if (newResponse.includes(option)) return;

    newResponse.push(option);
    setResponseFilter(newResponse);
    setCanAddNewFilter(true);
  }

  const removeResponseOption = (index: number): void => {
    const newFilters = [...responseFilter];
    newFilters.splice(index, 1);
    setResponseFilter(newFilters);
  }

  const updateFilter = (): void => {
    const newFilters = { ...filters };

    newFilters.responsesType[index] = {
      treatment: treatmentFilter,
      response: responseFilter
    };

    setFilters({ ...newFilters });
  }

  const clearFilters = (): void => {
    const newFilters = { ...filters };
    newFilters.responsesType = [{
      response: [],
      treatment: []
    }];

    setTreatmentFilter([]);
    setResponseFilter([]);

    setFilters({ ...newFilters });
  }

  useEffect(() => {
    updateFilter();
  }, [treatmentFilter, responseFilter]); // eslint-disable-line

  useEffect(() => {
    if (canAddNewFilter) addNewEmptyFilter();
  }, [canAddNewFilter]); // eslint-disable-line

  useEffect(() => {
    if (isClearFilter) {
      clearFilters();
      setIsClearFilter(false);
    }
  }, [isClearFilter]); // eslint-disable-line

  useEffect(() => {
    window.addEventListener('scroll', () => {
      calculateMenuPosition('treatment');
      calculateMenuPosition('response');
    });
  }, []);

  return (
    <>
      <div
        className={ "filter__backdrop " + ((showTreatmentDropdown || showResponseDropdown) ? 'active' : '') }
        onClick={ () => dropdownBgClick() }/>

      <div className="filter">
        <div className="filter__label">
          <span className="filter__label-text">
            PDC Model Treatment Response
            <InfoIcon title="Selects models based on performance against a broad panel of treatments. Performance categories are based on percentile scores. See model info for detail. Only responses indicated for the selected tumour type are shown. Please contact us for the full panel of responses."/>
          </span>
          { index === 0 && <span className="filter__label-clear" onClick={ () => clearFilters() }>Clear</span> }
        </div>

        <div className="filter-button">

          { /* Treatment Control */ }
          <div className={ `filter-button-row ${ treatmentFilter.length ? 'no-hover' : '' }` }>
            <div className="filter-button-toggle filter-button-treatment" onClick={ () => onFilterButtonClick('treatment') }>
              { !canShowTreatmentFilter() && <PlusIcon/> }

              <span className={ `filter-button__label ${ canShowTreatmentFilter() ? 'selected' : '' }` }>
                { !canShowTreatmentFilter() && 'Add PDC Model Treatment Response' }
                { selectedTreatmentOptions() }
              </span>
              <div className='filter-button__chevron'>
                { showTreatmentDropdown ? <ArrowDownIcon/> : <ArrowUpIcon/> }
              </div>
            </div>

            <div className={ "filter-menu filter-menu-treatment " + (showTreatmentDropdown ? 'opened' : '') }>
              { preloader && <Preloader/> }

              <div className="filter-menu-header">
                <div className="filter-menu__label">Treatment</div>
                <input type="text"
                       className="filter-menu__search"
                       placeholder="Search By Treatment"
                       onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                         searchHandler(event.target.value, 'treatment') }
                />
              </div>

              { !preloader && filterOptions && <DropdownMenu items={ filterOptions }
                                                             selectOption={ selectTreatmentOption }
                                                             multiSelect={ true }
              /> }

              { !preloader && !filterOptions.length && <div className="filter-no-data">
                  <span className="filter-no-data__title">No results found</span>
                  <span className="filter-no-data__label">
                      No results were found for your search, so try changing the search or filtering parameters and try again.
                  </span>
              </div> }
            </div>
          </div>

          { /* Responses Control */ }
          { canShowTreatmentFilter() && <div className={ `filter-button-row ${ canShowResponseFilter() ? 'no-hover' : '' }` }>
              <div className="filter-button-toggle filter-button-response" onClick={ () => onFilterButtonClick('response') }>
                  <span className={ `filter-button__label ${ !canShowResponseFilter() ? 'selected-gray' : '' }` }>
                    { !canShowResponseFilter() && 'Response Type' }
                    { selectedResponseOptions() }
                  </span>
                  <div className='filter-button__chevron'>
                    { showResponseDropdown ? <ArrowDownIcon/> : <ArrowUpIcon/> }
                  </div>
              </div>

              <div className={ "filter-menu filter-menu-response " + (showResponseDropdown ? 'opened' : '') }>
                { preloader && <Preloader/> }

                  <div className="filter-menu-header">
                      <div className="filter-menu__label">Response Type</div>
                      <input type="text"
                             className="filter-menu__search"
                             placeholder="Search By Response Type"
                             onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                               searchHandler(event.target.value, 'response') }
                      />
                  </div>

                { !preloader && filterOptions && <DropdownMenu items={ filterOptions }
                                                               selectOption={ selectResponseOption }
                                                               multiSelect={ true }
                /> }

                { !preloader && !filterOptions.length && <div className="filter-no-data">
                    <span className="filter-no-data__title">No results found</span>
                    <span className="filter-no-data__label">
                      No results were found for your search, so try changing the search or filtering parameters and try again.
                  </span>
                </div> }
              </div>
          </div> }
        </div>

      </div>
    </>
  )
}

export default ResponsesFilter;