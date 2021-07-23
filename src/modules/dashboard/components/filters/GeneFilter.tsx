import React, {
  ChangeEvent,
  FocusEvent,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
  useEffect,
} from "react";
import { FilterModel, GenesFilterModel } from "../../../../shared/models/filters.model";
import { getGeneFilteredData } from "../../../../api/filter.api";
import { FormGroup, FormControlLabel, debounce, Button } from "@material-ui/core";
import Preloader from "../../../../shared/components/Preloader";
import DropdownGenesMenu from "../DropdownGenesMenu";
import CloseIcon from "../../../../shared/components/Icons/CloseIcon";
import SearchIcon from "../../../../shared/components/Icons/Search";
import InfoIcon from "../../../../shared/components/Icons/InfoIcon";
import { createStyles, InputBase, makeStyles } from "@material-ui/core";
import { GeneAliasIcon, GeneIcon, ProteinIcon } from "shared/components/Icons";
import CustomCheckbox from "shared/components/CustomCheckbox";

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

/* TODO: Need to refactor this component to use universal functions instead of one-to-one binding each filter mechanic.
 *        Design makes this difficult to implement at the beginning according to not consistent logic of filters behaviour.
 * */
const GeneFilter = ({
  filters,
  setFilters,
  isClearFilter,
  setIsClearFilter,
}: GeneFilterProps): JSX.Element => {
  const [showGeneDropdown, setShowGeneDropdown] = useState(false);

  const [preloader, setPreloader] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    genes: [],
    aliases: [],
    proteins: [],
    includeExpressions: false,
  } as GenesFilterModel);
  const [offset, setOffset] = useState(0);
  const [geneFilter, setGeneFilter] = useState([] as string[]);
  const [aliasFilter, setAliasFilter] = useState([] as string[]);
  const [proteinFilter, setProteinFilter] = useState([] as string[]);
  const [includeExpressionsChecked, setIncludeExpressionsChecked] = useState(false);

  const [hideLoadMore, setHideLoadMore] = useState(false);

  const classes = useStyles();

  const dropdownBgClick = (): void => {
    setShowGeneDropdown(false);
    clearSearchInput();
  };

  const search = async (value: string): Promise<void> => {
    try {
      setPreloader(true);
      const { data } = await getGeneFilteredData(value);
      setFilterOptions(data);
      setHideLoadMore(false);

      const allCount = data.genes.length + data.aliases.length + data.proteins.length;
      const onlyCondition = data && allCount === 1;
      const emptyCondition = data && !(data.genes.length && data.aliases.length && data.proteins.length);
      const hiddenCondition = emptyCondition || onlyCondition;

      if (hiddenCondition) setHideLoadMore(true);
    } catch (e) {
      console.log(e);
    } finally {
      setPreloader(false);
      setOffset(offset + GENE_PAGE_LIMIT);
    }
  };

  const loadMore = async (): Promise<void> => {
    const value = document.querySelector<HTMLInputElement>('.genes-filter input')!.value;

    try {
      setPreloader(true);
      const { data } = await getGeneFilteredData(value, offset);
      const updated = {
        genes: data.genes.length > 0 ? [...filterOptions.genes, ...data.genes] : filterOptions.genes,
        aliases: data.aliases.length > 0 ? [...filterOptions.aliases, ...data.aliases] : filterOptions.aliases,
        proteins: data.proteins.length > 0 ? [...filterOptions.proteins, ...data.proteins] : filterOptions.proteins,
        includeExpressions: filterOptions.includeExpressions,
      } as GenesFilterModel;
      setFilterOptions(updated);

      const hiddenCondition = data && updated.genes.length === data.genesCount && updated.aliases.length === data.aliasesCount && updated.proteins.length === data.proteinsCount;

      if (hiddenCondition) setHideLoadMore(true);
    } catch (e) {
      console.log(e);
    } finally {
      setPreloader(false);
      setOffset(offset + GENE_PAGE_LIMIT);
    }
  }

  const searchHandler = useMemo(() => debounce(search, 500), []); // eslint-disable-line

  const openFilter = (event: any): void => {
    if (event.target.value) setShowGeneDropdown(true);
  }

  const onChangeFilterQuery = (event: any): void => {
    searchHandler(event.target.value);

    if (!event.target.value) setShowGeneDropdown(false);
    if (event.target.value) setShowGeneDropdown(true);
  }

  const selectedFilterOptions = (): JSX.Element => {
    return (
      <div className="filter-tags">
        {geneFilter.map((item: string, index: number) => (
          <div className="filter__tag" key={index}>
            <GeneIcon/>
            <span>{item}</span>
            <div className="close-icon">
              <CloseIcon close={() => removeOption(index, 'gene')} />
            </div>
          </div>
        ))}
        {aliasFilter.map((item: string, index: number) => (
          <div className="filter__tag" key={index}>
            <GeneAliasIcon/>
            <span>{item}</span>
            <div className="close-icon">
              <CloseIcon close={() => removeOption(index, 'alias')} />
            </div>
          </div>
        ))}
        {proteinFilter.map((item: string, index: number) => (
          <div className="filter__tag" key={index}>
            <ProteinIcon/>
            <span>{item}</span>
            <div className="close-icon">
              <CloseIcon close={() => removeOption(index, 'protein')} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const canShowFilter = (): boolean => {
    return !!((geneFilter && geneFilter.length) || (aliasFilter && aliasFilter.length) || (proteinFilter && proteinFilter.length));
  };

  const clearSearchInput = (): void => {
    const searchInput = document.querySelector<HTMLInputElement>('.genes-filter input');
    searchInput!.value = '';
  }

  // Methods of working with filters
  const selectGeneOption = (value: string): void => {
    const newOptions = [...geneFilter];

    if (newOptions.includes(value)) return;

    newOptions.push(value);
    setGeneFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.geneType.genes = newOptions;
    setFilters({ ...newFilters });
  };

  const selectAliasOption = (value: string): void => {
    const newOptions = [...aliasFilter];

    if (newOptions.includes(value)) return;

    newOptions.push(value);
    setAliasFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.geneType.aliases = newOptions;
    setFilters({ ...newFilters });
  };

  const selectProteinOption = (value: string): void => {
    const newOptions = [...proteinFilter];

    if (newOptions.includes(value)) return;

    newOptions.push(value);
    setProteinFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.geneType.proteins = newOptions;
    setFilters({ ...newFilters });
  };

  const selectOption = (value: string, type: string): void => {
    switch (type) {
      case 'gene':
        selectGeneOption(value);
        break;
      case 'alias':
        selectAliasOption(value);
        break;
      case 'protein':
        selectProteinOption(value);
        break;
    }
  };

  const removeGeneOption = (index: number): void => {
    const newOptions = [...geneFilter];
    newOptions.splice(index, 1);
    setGeneFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.geneType.genes = newOptions;
    setFilters({ ...newFilters });
  };

  const removeAliasOption = (index: number): void => {
    const newOptions = [...aliasFilter];
    newOptions.splice(index, 1);
    setAliasFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.geneType.aliases = newOptions;
    setFilters({ ...newFilters });
  };

  const removeProteinOption = (index: number): void => {
    const newOptions = [...proteinFilter];
    newOptions.splice(index, 1);
    setProteinFilter(newOptions);

    const newFilters = { ...filters };
    newFilters.geneType.proteins = newOptions;
    setFilters({ ...newFilters });
  };

  const removeOption = (index: number, type: string): void => {
    switch (type) {
      case 'gene':
        removeGeneOption(index);
        break;
      case 'alias':
        removeAliasOption(index);
        break;
      case 'protein':
        removeProteinOption(index);
        break;
    }
  };

  const clearFilters = (): void => {
    const newFilters = { ...filters };
    newFilters.geneType.genes = [];
    newFilters.geneType.aliases = [];
    newFilters.geneType.proteins = [];
    setGeneFilter([]);
    setAliasFilter([]);
    setProteinFilter([]);
    setFilters({ ...newFilters });
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
                onFocus={(event: FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => openFilter(event) }
                onChange={(
                  event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => onChangeFilterQuery(event) }
              />
              <div className="genes-search-tooltip">
                <InfoIcon
                  color="#0941AC"
                  title={
                    <>
                      You can enter up to 20 valid HUGO gene names or UniProt
                      IDs, e.g.{" "}
                      <a
                        className="tooltip-link"
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.genecards.org/cgi-bin/carddisp.pl?gene=BRCA1"
                      >
                        see aliases
                      </a>{" "}
                      for BRCA1.
                      <br />
                      <br />
                      Search carried out across mutations, expressions, copy
                      number variations and fusions. Full documentation{" "}
                      <a
                        className="tooltip-link"
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.genecards.org/cgi-bin/carddisp.pl?gene=BRCA1"
                      >
                        here
                      </a>
                      .
                    </>
                  }
                />
              </div>

              <div
                className={
                  "filter-menu genes-filter " +
                  (showGeneDropdown ? "opened" : "")
                }
              >
                {preloader && <Preloader />}

                {!preloader &&
                  (filterOptions.genes.length > 0 || filterOptions.aliases.length > 0 || filterOptions.proteins.length > 0) &&
                  (filters.geneType.genes.length + filters.geneType.aliases.length + filters.geneType.proteins.length) < MAX_GENE_LIMIT && (
                    <>
                      <DropdownGenesMenu
                        items={filterOptions}
                        selectOption={selectOption}
                      />
                      <div className={`load-more ${hideLoadMore ? ' hidden' : ''}`}>
                        <Button
                          variant="text"
                          color="primary"
                          className={classes.button}
                          onClick={ () => loadMore() }
                        >
                          Load more
                        </Button>
                      </div>
                    </>
                  )}

                {!preloader && !filterOptions.genes.length && !filterOptions.aliases.length && !filterOptions.proteins.length && (
                  <div className="filter-no-data">
                    <span className="filter-no-data__title">
                      No results found
                    </span>
                    <span className="filter-no-data__label">
                      No results were found for your search. Please try another gene or protein name.
                    </span>
                  </div>
                )}

                {(filters.geneType.genes.length + filters.geneType.aliases.length + filters.geneType.proteins.length) >= MAX_GENE_LIMIT && (
                  <div className="filter-no-data">
                    <span className="filter-no-data__title">
                      Gene limit is exceeded
                    </span>
                    <span className="filter-no-data__label">
                      You can't use greater {MAX_GENE_LIMIT} genes for searching
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
              control={
                <CustomCheckbox
                  checked={ includeExpressionsChecked }
                  onChange={ () => onChangeIncludeExpressions() }
                />
              }
              label={
                <div className="include-expressions__label">
                  Enable RNA expression in search
                  <InfoIcon title="Include expressions (RNA) data in your search, off by default" />
                </div>
              }
          />
          </FormGroup>
        </div>
        <div className="genes-filter-selected">
          {canShowFilter() ? selectedFilterOptions() : ""}
        </div>
      </div>
    </>
  );
};

export default GeneFilter;
