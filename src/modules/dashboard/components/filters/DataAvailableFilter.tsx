import React from "react";
import * as MCore from "@material-ui/core";
import Preloader from "../../../../shared/components/Preloader";
import DropdownMenu from "../DropdownMenu";
import CloseIcon from "../../../../shared/components/Icons/CloseIcon";
import Icons from "../../../../shared/components/Icons"

import { FilterModel } from "../../../../shared/models/filters.model";

interface DataAvailableFilterProps {
  setFilters: React.Dispatch<React.SetStateAction<FilterModel>>;
  filters: FilterModel;
  isClearFilter: boolean;
  setIsClearFilter: (state: boolean) => void;
}

// 'PDC Model Treatment Response'
const VALUES = ['NGS', 'Patient Treatment History', 'Growth Characteristics', 'Plasma', 'PBMC']

const SEARCH_DEBOUNCE = 300;
const CLEAR_AND_FOCUS_DEBOUNCE = 100;

const DataAvailableFilter = (({ ...rest }: DataAvailableFilterProps) => {
  const setFilters = rest.setFilters;
  const filters = rest.filters;
  const isClearFilter = rest.isClearFilter;
  const setIsClearFilter = rest.setIsClearFilter;

  const searchRef = React.useRef<HTMLInputElement>(null);
  const [preloader, setPreloader] = React.useState(false);
  const [filterOptions, setFilterOptions] = React.useState([] as string[]);
  const [dataAvailableFilter, setDataAvailableFilter] = React.useState([] as string[]);

  const [dpdIsOpened, setDpdIsOpened] = React.useState(false);
  const dropdownBgClick = (e?: React.MouseEvent<HTMLDivElement>): void => {
    if (e) e.preventDefault();
    if (searchRef.current) searchRef.current.value = '';
    setDpdIsOpened(false)
  };

  const clearFilters = (e?: React.MouseEvent<HTMLSpanElement>): void => {
    if (e) e.preventDefault()
    const newFilters = { ...filters };
    newFilters.dataAvailable = [];
    setFilters({ ...newFilters });
    setDataAvailableFilter(newFilters.dataAvailable);
  };

  const clearAndFocusSearchInput = MCore.debounce(() => {
    if (!searchRef.current) return;
    searchRef.current.focus()
    searchRef.current.value = ''
  }, CLEAR_AND_FOCUS_DEBOUNCE)

  const prepareDataAvailableOptions = (success: any) => {
    setFilterOptions(success.data)
  }

  const requestFilteredDataAvailableOptions = (search = "") => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })

    setPreloader(true)
    Promise.resolve({ data: VALUES.filter(i => new RegExp(search, 'gi').test(i)) })
      .then(success => canceled || (prepareDataAvailableOptions(success)))
      .catch(cancel)
      .finally(() => canceled || setPreloader(false))

    return cancel;
  };


  const search = MCore.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = searchRef.current ? searchRef.current.value : e.target.value;
    requestFilteredDataAvailableOptions(searchValue.trim());
  }, SEARCH_DEBOUNCE);

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

  const selectOption = (value: string): void => {
    const newOptions = [...dataAvailableFilter];

    if (newOptions.includes(value)) return;

    newOptions.push(value);
    setDataAvailableFilter(newOptions);
    const newFilters = { ...filters };
    newFilters.dataAvailable = newOptions;
    setFilters({ ...newFilters });
  }

  const removeOption = (index: number): void => {
    const newOptions = [...dataAvailableFilter];
    newOptions.splice(index, 1);
    setDataAvailableFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.dataAvailable = newOptions;
    setFilters({ ...newFilters });
  }

  const loadDefaultOptions = async (): Promise<any> => {
    let canceled = false;
    const cancel = ((reason: any) => { canceled = true; console.log('[ reason ]', reason); })
    setPreloader(true);

    Promise.resolve({ data: VALUES })
      .then(success => canceled || (prepareDataAvailableOptions(success)))
      .catch(cancel)
      .finally(() => canceled || setPreloader(false))

    return cancel;
  }

  const onFilterButtonClick = (): void => {
    setDpdIsOpened(!dpdIsOpened);
    calculateMenuPosition('model');
    loadDefaultOptions();
    clearAndFocusSearchInput()
  }

  const selectedFilterOptions = (): JSX.Element => {
    return (<div className="filter-tags">
      {dataAvailableFilter.map((item: string, index: number) => (
        <div className="filter__tag" key={index}>
          <span>{item}</span>
          <div className="close-icon">
            <CloseIcon close={() => removeOption(index)} />
          </div>
        </div>
      ))
      }

      <div className="filter-tags__new-btn" onClick={() => setDpdIsOpened(true)}>
        <Icons.GreenPlusIcon />
      </div>
    </div>)
  }

  React.useEffect(() => {
    if (isClearFilter) {
      clearFilters();
      setIsClearFilter(false);
    }
  }, [isClearFilter]); // eslint-disable-line

  React.useEffect(() => {
    window.addEventListener('scroll', () => {
      calculateMenuPosition('model');
    });
  }, []);


  return (
    <>
      <div className={"filter__backdrop " + (dpdIsOpened ? "active" : "")} onClick={dropdownBgClick} />
      <div className="filter">
        <div className="filter__label">
          <span className="filter__label-text">
            Data Available
            <Icons.InfoIcon title="Selects models by Data available filters." />
          </span>
          <span className="filter__label-clear" onClick={() => clearFilters()}>Clear</span>
        </div>

        <div className="filter-button">
          <div className={`filter-button-row ${dataAvailableFilter.length ? 'no-hover' : ''}`}>
            <div className="filter-button-toggle filter-button-model" onClick={() => onFilterButtonClick()}>
              {dataAvailableFilter.length === 0 && <Icons.PlusIcon />}

              <span className={`filter-button__label ${dataAvailableFilter.length === 0 || 'selected-gray'}`}>
                {dataAvailableFilter.length === 0 ? 'Add Model ID' : selectedFilterOptions()}
              </span>
              <div className='filter-button__chevron'>
                {dpdIsOpened ? <Icons.ArrowDownIcon /> : <Icons.ArrowUpIcon />}
              </div>
            </div>

            <div className={"filter-menu filter-menu-model " + (dpdIsOpened ? 'opened' : '')}>
              {preloader && <Preloader />}

              <div className="filter-menu-header">
                <div className="filter-menu__label">Data Available</div>
                <input type="text" ref={searchRef}
                  className="filter-menu__search"
                  placeholder="Search by Data Available"
                  onChange={search}
                />
              </div>


              {!preloader && filterOptions && <DropdownMenu items={filterOptions}
                selectOption={selectOption}
                multiSelect={true}
              />}

              {!preloader && !filterOptions.length && <div className="filter-no-data">
                <span className="filter-no-data__title">No results found</span>
                <span className="filter-no-data__label">
                  No results were found for your search, so try changing the search or filtering parameters and try again.
                </span>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default DataAvailableFilter