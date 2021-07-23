import React, { ChangeEvent, Dispatch, SetStateAction, useMemo, useState, useEffect } from "react";
import { FilterModel } from "../../../../shared/models/filters.model";
import { getModelFilteredData } from "../../../../api/filter.api";
import { debounce } from "@material-ui/core";
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";
import Preloader from "../../../../shared/components/Preloader";
import DropdownMenu from "../DropdownMenu";
import CloseIcon from "../../../../shared/components/Icons/CloseIcon";
import GreenPlusIcon from "../../../../shared/components/Icons/GreenPlusIcon";
import PlusIcon from "../../../../shared/components/Icons/PlusIcon";
import ArrowDownIcon from '../../../../shared/components/Icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../shared/components/Icons/ArrowUpIcon';

interface ModelFilterProps {
  setFilters: Dispatch<SetStateAction<FilterModel>>;
  filters: FilterModel;
  isClearFilter: boolean;
  setIsClearFilter: (state: boolean) => void;
}

/* TODO: Need to refactor this component to use universal functions instead of one-to-one binding each filter mechanic.
*        Design makes this difficult to implement at the beginning according to not consistent logic of filters behaviour.
* */
const ModelFilter = ({ filters, setFilters, isClearFilter, setIsClearFilter }: ModelFilterProps): JSX.Element => {
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [preloader, setPreloader] = useState(false);
  const [filterOptions, setFilterOptions] = useState([] as string[]);

  const [modelFilter, setModelFilter] = useState([] as string[]);

  const dropdownBgClick = (): void => {
    setShowModelDropdown(false);
  }

  const search = async (value: string): Promise<void> => {
    try {
      setPreloader(true);
      const { data } = await getModelFilteredData(value);
      setFilterOptions([...data]);
    } catch (e) {
      console.log(e);
    } finally {
      setPreloader(false);
    }
  }

  const loadDefaultOptions = async (query?: string): Promise<void> => {
    try {
      setPreloader(true);
      const { data } = await getModelFilteredData(query);
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

  const onFilterButtonClick = (): void => {
    setShowModelDropdown(!showModelDropdown);
    calculateMenuPosition('model');
    loadDefaultOptions();
  }

  const selectedFilterOptions = (): JSX.Element => {
    return (<div className="filter-tags">
      { modelFilter.map((item: string, index: number) => (
        <div className="filter__tag" key={ index }>
          <span>{ item }</span>
          <div className="close-icon">
            <CloseIcon close={ () => removeOption(index) }/>
          </div>
        </div>
      ))
      }

      <div className="filter-tags__new-btn" onClick={ () => setShowModelDropdown(true) }>
        <GreenPlusIcon/>
      </div>
    </div>)
  }

  const canShowModelFilter = (): boolean => {
    return !!(modelFilter && modelFilter.length)
  }

  // Methods of working with filters
  const selectOption = (value: string): void => {
    const newOptions = [...modelFilter];

    if (newOptions.includes(value)) return;

    newOptions.push(value);
    setModelFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.modelType = newOptions;
    setFilters({ ...newFilters });
  }

  const removeOption = (index: number): void => {
    const newOptions = [...modelFilter];
    newOptions.splice(index, 1);
    setModelFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.modelType = newOptions;
    setFilters({ ...newFilters });
  }

  const clearFilters = (): void => {
    const newFilters = { ...filters };
    newFilters.modelType = [];
    setModelFilter([]);
    setFilters({ ...newFilters });
  }

  useEffect(() => {
    if (isClearFilter) {
      clearFilters();
      setIsClearFilter(false);
    }
  }, [isClearFilter]); // eslint-disable-line

  useEffect(() => {
    window.addEventListener('scroll', () => {
      calculateMenuPosition('model');
    });
  }, []);

  return (
    <>
      <div
        className={ "filter__backdrop " + ((showModelDropdown) ? 'active' : '') }
        onClick={ () => dropdownBgClick() }/>

      <div className="filter">
        <div className="filter__label">
          <span className="filter__label-text">
            Model ID
            <InfoIcon title="Model Filter"/>
          </span>
          <span className="filter__label-clear" onClick={ () => clearFilters() }>Clear</span>
        </div>

        <div className="filter-button">
          {<div className={ `filter-button-row ${ modelFilter.length ? 'no-hover' : '' }` }>
            <div className="filter-button-toggle filter-button-model" onClick={ () => onFilterButtonClick() }>
              { !canShowModelFilter() && <PlusIcon/> }

              <span className={ `filter-button__label ${ !modelFilter ? 'selected-gray' : '' }` }>
                    { canShowModelFilter() ? selectedFilterOptions() : 'Add Model ID' }
              </span>
              <div className='filter-button__chevron'>
                { showModelDropdown ? <ArrowDownIcon/> : <ArrowUpIcon/> }
              </div>
            </div>

            <div className={ "filter-menu filter-menu-model " + (showModelDropdown ? 'opened' : '') }>
              { preloader && <Preloader/> }

              <div className="filter-menu-header">
                <div className="filter-menu__label">Model ID</div>
                <input type="text"
                       className="filter-menu__search"
                       placeholder="Search by Model ID"
                       onChange={ (event: ChangeEvent<HTMLInputElement>) => searchHandler(event.target.value) }
                />
              </div>

              { !preloader && filterOptions && <DropdownMenu items={ filterOptions }
                                                             selectOption={ selectOption }
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

export default ModelFilter;