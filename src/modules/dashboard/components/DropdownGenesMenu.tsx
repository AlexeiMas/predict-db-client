import { useEffect, useState } from "react";
import { GeneAliasIcon, GeneIcon, ProteinIcon } from "shared/components/Icons";

interface OptionItems {
  genes: string[];
  aliases: string[];
  proteins: string[];
}

interface DropdownGenesMenuProps {
  items: OptionItems;
  selectOption: (value: string, type: string) => void;
}

interface DropdownMenuOption {
  label: string;
  selected: boolean;
}

const DropdownGenesMenu = ({
  items,
  selectOption,
}: DropdownGenesMenuProps): JSX.Element => {
  const [genesOptions, setGenesOptions] = useState([] as any[]);
  const [aliasesOptions, setAliasesOptions] = useState([] as any[]);
  const [proteinsOptions, setProteinsOptions] = useState([] as any[]);

  const getOptions = (values: string[]): DropdownMenuOption[] => {
    return values && values.length > 0
      ? values.map((item: string) => {
          return {
            label: item,
            selected: false,
          };
        })
      : [];
  };

  useEffect(() => {
    const newGenes = getOptions(items.genes);
    const newAliases = getOptions(items.aliases);
    const newProteins = getOptions(items.proteins);

    setGenesOptions(newGenes);
    setAliasesOptions(newAliases);
    setProteinsOptions(newProteins);
  }, [items]);

  const onSelectOption = (item: DropdownMenuOption, type: string): void => {
    item.selected = !item.selected;
    selectOption(item.label, type);
  };

  return (
    <div className="filter-menu-genes">
      {genesOptions && !!genesOptions.length && (
        <div className="filter-menu-items genes-filter">
          <div className="filter-menu-header genes-filter">
            <div className="filter-menu__label">Genes</div>
          </div>
          {genesOptions.map((item: DropdownMenuOption, index: number) => (
            <div
              className="filter-menu-item genes-filter"
              key={index}
              onClick={() => onSelectOption(item, 'gene')}
            >
              <GeneIcon/>
              {item.label}
            </div>
          ))}
        </div>
      )}
      {aliasesOptions && !!aliasesOptions.length && (
        <div className="filter-menu-items genes-filter">
          <div className="filter-menu-header genes-filter">
            <div className="filter-menu__label">Gene Aliases</div>
          </div>
          {aliasesOptions.map((item: DropdownMenuOption, index: number) => (
            <div
              className="filter-menu-item genes-filter"
              key={index}
              onClick={() => onSelectOption(item, 'alias')}
            >
              <GeneAliasIcon/>
              {item.label}
            </div>
          ))}
        </div>
      )}
      {proteinsOptions && !!proteinsOptions.length && (
        <div className="filter-menu-items genes-filter">
          <div className="filter-menu-header genes-filter">
            <div className="filter-menu__label">Proteins</div>
          </div>
          {proteinsOptions.map((item: DropdownMenuOption, index: number) => (
            <div
              className="filter-menu-item genes-filter"
              key={index}
              onClick={() => onSelectOption(item, 'protein')}
            >
              <ProteinIcon/>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownGenesMenu;
