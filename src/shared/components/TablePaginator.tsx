export interface TablePaginationProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  selectPage: any;
  onPrevPage?: (page: number) => void;
  onNextPage?: (page: number) => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
}

const TablePaginator = (props: TablePaginationProps): JSX.Element => {
  const { selectPage, currentPage, totalPages } = props;

  const onPrevPage = (): void => {
    const prevPage = currentPage - 1;

    if (prevPage >= 0) {
      selectPage(prevPage);
    }
  };

  const onNextPage = (): void => {
    const nextPage = currentPage + 1;

    if (nextPage < totalPages) {
      selectPage(nextPage);
    }
  };

  const onFirstPage = (): void => {
    selectPage(0);
  };

  const onLastPage = (): void => {
    selectPage(totalPages - 1);
  };

  const canShowControls = (): boolean => totalPages > 1;

  return (
    <div className="data-table__pagination">
      <div className="pagination">
        {canShowControls() &&
          <div className="left">
            <button onClick={onFirstPage.bind(null)} className="pagination__button">First</button>
            <button onClick={onPrevPage.bind(null)} className="pagination__button">Previous</button>
          </div>
        }
        <div className="middle">
          <span>Page {props.currentPage + 1}</span>
          <span>&nbsp;of {props.totalPages}</span>
        </div>
        {canShowControls() &&
          <div className="right">
            <button onClick={onNextPage.bind(null)} className="pagination__button">Next</button>
            <button onClick={onLastPage.bind(null)} className="pagination__button">Last</button>
          </div>
        }
      </div>
    </div>
  );
};

export default TablePaginator;