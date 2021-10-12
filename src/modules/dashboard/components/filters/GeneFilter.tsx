import React, {
  ChangeEvent,
  FocusEvent,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  FilterModel,
  GenesFilterModel,
} from "../../../../shared/models/filters.model";
import { getGeneFilteredDataByArray } from "../../../../api/filter.api";
import {
  FormGroup,
  FormControlLabel,
  debounce,
  Button,
} from "@material-ui/core";
import Preloader from "../../../../shared/components/Preloader";
import DropdownGenesMenu from "../DropdownGenesMenu";
import CloseIcon from "../../../../shared/components/Icons/CloseIcon";
import SearchIcon from "../../../../shared/components/Icons/Search";
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";
import { createStyles, InputBase, makeStyles } from "@material-ui/core";
import { GeneAliasIcon, GeneIcon, ProteinIcon } from "shared/components/Icons";
import CustomCheckbox from "shared/components/CustomCheckbox";
import * as  Common from './common';


interface GeneFilterProps {
  setFilters: Dispatch<SetStateAction<FilterModel>>;
  filters: FilterModel;
  isClearFilter: boolean;
  setIsClearFilter: (state: boolean) => void;
}

const MAX_GENE_LIMIT = 20;
const GENE_PAGE_LIMIT = parseInt(process.env.REACT_APP_GENE_PAGE_LIMIT!);
const useStyles = makeStyles(() =>
  createStyles({
    input: {
      marginLeft: "10px",
      borderRadius: "8px",
      padding: "7px",
      flex: 1,
      color: "#0941AC",
    },
    button: {
      backgroundColor: "#EEEEF2",
      color: "#656790",
      borderRadius: "8px",
      "&:hover": {
        backgroundColor: "#EEEEF2",
      },
    },
  })
);


const GENES_FILTER_INPUT_CLASS_NAME = ".genes-filter input"

/* cSpell: disable */
export const TEST_GENES_STRING = [
  'TAZ', 'LTA', 'WIZ', 'DPT', 'DST', 'EMD', 'MAK', 'NIN', 'NNT',
  'NP', 'LF', 'XR', 'LW', 'VP', 'PP', 'Y2', 'H6', 'TR', 'DB',
  'Q5JTD0', 'Q01664', 'Q8WW62', 'Q96B21', 'Q9Y2Y6', 'Q5T0D9',
].join(','); /* eslint-disable-line */

console.log('[ TEST_GENES_STRING ]', TEST_GENES_STRING);

/* TODO: Need to refactor this component to use universal functions instead of one-to-one binding each filter mechanic.
 *        Design makes this difficult to implement at the beginning according to not consistent logic of filters behaviour.
 * */
const GeneFilter = ({ filters, setFilters, isClearFilter, setIsClearFilter, }: GeneFilterProps): JSX.Element => {

  const [showGeneDropdown, setShowGeneDropdown] = useState(false);
  const [preloader, setPreloader] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ genes: [], aliases: [], proteins: [], includeExpressions: false, } as GenesFilterModel);
  const [offset, setOffset] = useState(0);
  const [includeExpressionsChecked, setIncludeExpressionsChecked] = useState(false);
  const [hideShowMore, setHideShowMore] = useState(false);
  const classes = useStyles();

  const dropdownBgClick = (): void => { setShowGeneDropdown(false); clearSearchInput(); };

  const searchInputState = React.useRef([])

  const search = async (value: string[]): Promise<void> => {
    setHideShowMore(false);
    try {
      setPreloader(true);
      const { data } = await getGeneFilteredDataByArray(value);
      if (!data) throw new Error("No data in search response");
      const stub = { genes: [], aliases: [], proteins: [], includeExpressions: false }
      const updatedFilterOptions = { ...stub, ...data }
      const processed = Object.entries(updatedFilterOptions).reduce(
        (acc, [key, value]) => {
          const type = key as 'genes' | 'proteins' | 'aliases'
          const res = value as string[]
          if (['genes', 'proteins', 'aliases'].includes(type) && res.length) {
            const joined = [...res, ...acc.geneType[type]] as string[];
            const uniq = joined.reduce((acc: string[], i: string) => [...acc, ...(acc.includes(i) ? [] : [i])], [])
            acc.geneType[type] = uniq as string[];
          }
          return acc;
        },
        { ...filters }
      )
      setFilters({ ...filters, ...processed })
      setFilterOptions(updatedFilterOptions);
      const showMoreIsHidden =
        (data.genesCount >= GENE_PAGE_LIMIT ||
          data.aliasesCount >= GENE_PAGE_LIMIT ||
          data.proteinsCount >= GENE_PAGE_LIMIT) === false;
      setHideShowMore(showMoreIsHidden);
    } catch (error) {
      console.log('[' + search.name + '][ERROR]', error);
    } finally {
      setPreloader(false);
      setOffset(offset + GENE_PAGE_LIMIT);
    }
  };


  const showMore = async (): Promise<void> => {
    const value = document.querySelector<HTMLInputElement>(GENES_FILTER_INPUT_CLASS_NAME)!.value.split(',').map((s?: string) => (s || '').trim()).filter(Boolean);
    try {
      setPreloader(true);
      const { data } = await getGeneFilteredDataByArray(value, offset);
      if (!data) throw new Error("No data in loadMore response");
      const stub = { genes: [], aliases: [], proteins: [], includeExpressions: false }
      const updated = {
        genes:
          data.genes.length > 0
            ? [...filterOptions.genes, ...data.genes]
            : filterOptions.genes,
        aliases:
          data.aliases.length > 0
            ? [...filterOptions.aliases, ...data.aliases]
            : filterOptions.aliases,
        proteins:
          data.proteins.length > 0
            ? [...filterOptions.proteins, ...data.proteins]
            : filterOptions.proteins,
        includeExpressions: filterOptions.includeExpressions,
      } as GenesFilterModel;
      setFilterOptions({ ...stub, ...updated });
      const hiddenCondition =
        updated.genes.length === data.genesCount &&
        updated.aliases.length === data.aliasesCount &&
        updated.proteins.length === data.proteinsCount;
      setHideShowMore(hiddenCondition);
    } catch (e) {
      console.log(e);
    } finally {
      setPreloader(false);
      setOffset(offset + GENE_PAGE_LIMIT);
    }
  };

  const searchHandler = useMemo(() => debounce(search, 500), []); // eslint-disable-line

  const openFilter = (event: any): void => { if (event.target.value) setShowGeneDropdown(true); };

  const onChangeFilterQuery = (event: any): void => {
    const value = event.target.value.split(',').map((s?: string) => (s || '').trim()).filter(Boolean)
    searchInputState.current = value;

    searchHandler(value);
    const shouldShowDPD = Boolean(event.target.value && event.target.value.includes(',') === false)
    setShowGeneDropdown(shouldShowDPD);
  };

  const selectedFilterOptions = (): JSX.Element => {
    return (
      <div className="filter-tags">
        {filterOptions.genes.map((item: string, index: number) => (
          <div className="filter__tag" key={index}>
            <GeneIcon />
            <span>{item}</span>
            <div className="close-icon">
              <CloseIcon close={() => removeOption(index, "gene")} />
            </div>
          </div>
        ))}
        {filterOptions.aliases.map((item: string, index: number) => (
          <div className="filter__tag" key={index}>
            <GeneAliasIcon />
            <span>{item}</span>
            <div className="close-icon">
              <CloseIcon close={() => removeOption(index, "alias")} />
            </div>
          </div>
        ))}
        {filterOptions.proteins.map((item: string, index: number) => (
          <div className="filter__tag" key={index}>
            <ProteinIcon />
            <span>{item}</span>
            <div className="close-icon">
              <CloseIcon close={() => removeOption(index, "protein")} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const canShowFilter = (): boolean => {
    return !!(
      (filterOptions.genes && filterOptions.genes.length) ||
      (filterOptions.aliases && filterOptions.aliases.length) ||
      (filterOptions.proteins && filterOptions.proteins.length)
    );
  };

  const clearSearchInput = (): void => {
    const searchInput = document.querySelector<HTMLInputElement>(GENES_FILTER_INPUT_CLASS_NAME);
    searchInput!.value = "";
  };

  // Methods of working with filters
  const selectGeneOption = (value: string): void => {
    const newFilters = { ...filters };
    if (newFilters.geneType.genes.includes(value)) return;
    newFilters.geneType.genes.push(value)
    setFilterOptions(newFilters.geneType);
    setFilters({ ...newFilters });
  };


  const selectAliasOption = (value: string): void => {
    const newFilters = { ...filters };
    if (newFilters.geneType.aliases.includes(value)) return;
    newFilters.geneType.aliases.push(value)
    setFilterOptions(newFilters.geneType);
    setFilters({ ...newFilters });
  };


  const selectProteinOption = (value: string): void => {
    const newFilters = { ...filters };
    if (newFilters.geneType.proteins.includes(value)) return;
    newFilters.geneType.proteins.push(value)
    setFilterOptions(newFilters.geneType);
    setFilters({ ...newFilters });
  };


  const selectOption = (value: string, type: string): void => {
    switch (type) {
      case "gene":
        selectGeneOption(value);
        break;
      case "alias":
        selectAliasOption(value);
        break;
      case "protein":
        selectProteinOption(value);
        break;
    }
  };


  const removeGeneOption = (index: number): void => {
    const newFilters = { ...filters };
    if (newFilters.geneType.genes.length > 0) {
      newFilters.geneType.genes.splice(index, 1);
    }
    setFilterOptions(newFilters.geneType);
    setFilters({ ...newFilters });
  };


  const removeAliasOption = (index: number): void => {
    const newFilters = { ...filters };
    if (newFilters.geneType.aliases.length > 0) {
      newFilters.geneType.aliases.splice(index, 1);
    }
    setFilterOptions(newFilters.geneType);
    setFilters({ ...newFilters });
  };


  const removeProteinOption = (index: number): void => {
    const newFilters = { ...filters };
    if (newFilters.geneType.proteins.length > 0) {
      newFilters.geneType.proteins.splice(index, 1);
    }
    setFilterOptions(newFilters.geneType);
    setFilters({ ...newFilters });
  };


  const removeOption = (index: number, type: string): void => {
    switch (type) {
      case "gene":
        removeGeneOption(index);
        break;
      case "alias":
        removeAliasOption(index);
        break;
      case "protein":
        removeProteinOption(index);
        break;
    }
  };


  const clearFilters = (): void => {
    const newFilters = { ...filters };
    newFilters.geneType.genes = [];
    newFilters.geneType.aliases = [];
    newFilters.geneType.proteins = [];
    setFilterOptions(newFilters.geneType)
    clearSearchInput();
  };


  const onChangeIncludeExpressions = () => {
    setIncludeExpressionsChecked(!includeExpressionsChecked);
    const newFilters = { ...filters };
    newFilters.geneType.includeExpressions = !includeExpressionsChecked;
    setFilters({ ...newFilters });
  };


  useEffect(() => {
    if (isClearFilter) {
      clearFilters();
      setIsClearFilter(false);
      setIncludeExpressionsChecked(false);
    }
  }, [isClearFilter]); // eslint-disable-line


  return (
    <>
      <div
        className={"filter__backdrop " + (showGeneDropdown ? "active" : "")}
        onClick={() => dropdownBgClick()}
      />
      <div className="filter">
        <div className="filter__label">
          <span className="filter__label-text"></span>
          <span className="filter__label-clear" onClick={() => clearFilters()}>
            Clear
          </span>
        </div>
        <div className="filter-button genes-filter">
          {
            <div className="filter-button-row">
              <SearchIcon />
              <InputBase
                className={`${classes.input} genes-search-query`}
                placeholder="Search by gene or protein name"
                inputProps={{ "aria-label": "gene name" }}
                onFocus={(event: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => openFilter(event)}
                onChange={(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => onChangeFilterQuery(event)}
              />

              <Common.GenesSearchTooltip />

              <div className={"filter-menu genes-filter " + (showGeneDropdown ? "opened" : "")} >
                {preloader && <Preloader />}
                {!preloader &&
                  (filterOptions.genes.length > 0 ||
                    filterOptions.aliases.length > 0 ||
                    filterOptions.proteins.length > 0) &&
                  filters.geneType.genes.length +
                  filters.geneType.aliases.length +
                  filters.geneType.proteins.length <
                  MAX_GENE_LIMIT && (
                    <>
                      <DropdownGenesMenu
                        items={filterOptions}
                        selectOption={selectOption}
                      />
                      <div className={`load-more ${hideShowMore ? " hidden" : ""}`} >
                        <Button
                          variant="text"
                          color="primary"
                          className={classes.button}
                          onClick={() => showMore()}
                        >
                          Show more
                        </Button>
                      </div>
                    </>
                  )}

                {!preloader &&
                  !filterOptions.genes.length &&
                  !filterOptions.aliases.length &&
                  !filterOptions.proteins.length && (
                    <div className="filter-no-data">
                      <span className="filter-no-data__title">
                        No results found
                      </span>
                      <span className="filter-no-data__label">
                        No results were found for your search. Please try
                        another gene or protein name.
                      </span>
                    </div>
                  )}
                {filters.geneType.genes.length +
                  filters.geneType.aliases.length +
                  filters.geneType.proteins.length >=
                  MAX_GENE_LIMIT && (
                    <div className="filter-no-data">
                      <span className="filter-no-data__title">
                        Gene limit is exceeded
                      </span>
                      <span className="filter-no-data__label">
                        You can't search for greater than {MAX_GENE_LIMIT} genes.
                      </span>
                    </div>
                  )}
              </div>
            </div>
          }
        </div>
        <div className="include-expressions">
          <FormGroup row>
            <FormControlLabel
              control={<CustomCheckbox checked={includeExpressionsChecked} onChange={() => onChangeIncludeExpressions()} />}
              label={
                <div className="include-expressions__label">
                  Enable RNA expression in search
                  <InfoIcon title="Include expressions (RNA) data in your search, off by default. Exporting data can take some time. Whilst we have broad coverage of most protein-coding genes, some genes may be absent in results due to low expression levels." />
                </div>
              }
            />
          </FormGroup>
        </div>
        <div className="genes-filter-selected"> {canShowFilter() ? selectedFilterOptions() : ""} </div>
      </div>
    </>
  );
};

export default GeneFilter;
