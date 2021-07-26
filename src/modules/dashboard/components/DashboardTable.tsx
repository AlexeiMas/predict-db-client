import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TableHeaderModel } from "../../../shared/models";

import {
  GrowthCharacteristicsIcon,
  NGSIcon,
  PatientTreatmentHistoryIcon,
  PDCTreatmentResponsesIcon,
  SortIcon,
  PBMCIcon,
  PlasmaIcon
} from "../../../shared/components/Icons";

import TableBody from "@material-ui/core/TableBody";
import { ClinicalSampleModel } from "../../../shared/models/clinical-sample.model";
import TablePaginator from "../../../shared/components/TablePaginator";
import React, { Dispatch, SetStateAction } from "react";
import { withStyles } from "@material-ui/core/styles";
import { createStyles } from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";

interface DashboardTableProps {
  records: ClinicalSampleModel[];
  count: number;
  rowClick: (sample: ClinicalSampleModel) => void;
  selectedPageIndex: number;
  changePage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  sort: string;
  order: string;
  setSort: (field: string) => void;
  setOrder: (dir: string) => void;
}

const StyledTableCell = withStyles(() =>
  createStyles({ body: { fontSize: 16 } })
)(TableCell);

const DashboardTable = (props: DashboardTableProps): JSX.Element => {
  const { records, count, rowClick, selectedPageIndex, changePage, pageSize, sort, order, setSort, setOrder } =
    props;

  const tableHeaders: TableHeaderModel[] = [
    { label: "Model ID", field: 'PDC Model', withSort: true },
    { label: "Primary tumour type", field: 'Primary Tumour Type', withSort: true },
    { label: "Subtype", field: 'Tumour Sub-type', withSort: true },
    { label: "Sample Collection Site", field: 'Sample Collection Site', withSort: true },
    { label: "Diagnosis", field: 'Diagnosis', withSort: true },
    { label: "Data available", field: '', withSort: false },
  ];

  const pageCount = count / pageSize;
  const totalPages = pageCount >= 1 ? Math.ceil(pageCount) : 1;

  const sortHandler = (field: string): void => {
    setSort(field);
    setOrder(sort === field ? (order === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  return (
    <>
      {records && !records.length && (
        <div className="empty">
          <h1 className="empty__title">No results found</h1>
          <div className="empty__text">
            No results were found for you search, if your search parameters show no models, please reach out and we can carry out a deeper analysis of our raw data according to your requirements.
          </div>
        </div>
      )}
      {records && !!records.length && (
        <div className="data-table">
          <div className="table">
            <TableContainer component={Paper}>
              <Table aria-label="customized table" className="table">
                <TableHead>
                  <TableRow>
                    {tableHeaders.map(
                      (header: TableHeaderModel, index: number) => (
                        <StyledTableCell key={index}>
                          <div className="table__cell">
                            <div>{header.label}</div>
                            {header.withSort && (
                              <div className="table__button" onClick={ () => sortHandler(header.field) }>
                                <SortIcon />
                              </div>
                            )}
                          </div>
                        </StyledTableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {records &&
                    records.map((row: ClinicalSampleModel, index: number) => (
                      <TableRow key={index} onClick={() => rowClick(row)}>
                        <StyledTableCell component="th" scope="row">
                          {row && row.pdcModel}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row && row.primaryTumourType}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row && row.tumourSubType}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row && row.sampleCollectionSite}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row && row.diagnosis}
                        </StyledTableCell>
                        <StyledTableCell>
                          <div className="table__data-available">
                            <div className="table__icon">
                              <NGSIcon isActive={row.hasNgsData} />
                            </div>
                            <div className="table__icon">
                              <PatientTreatmentHistoryIcon
                                isActive={row.hasPatientTreatmentHistory}
                              />
                            </div>
                            <div className="table__icon">
                              <PDCTreatmentResponsesIcon
                                isActive={row.hasResponseData}
                              />
                            </div>
                            <div className="table__icon">
                              <GrowthCharacteristicsIcon
                                isActive={row.hasGrowthCharacteristics}
                              />
                            </div>
                            <div className="table__icon">
                              <PlasmaIcon
                                isActive={row.Plasma}
                              />
                            </div>
                            <div className="table__icon">
                              <PBMCIcon
                                isActive={row.PBMC}
                              />
                            </div>
                          </div>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePaginator
              currentPage={selectedPageIndex}
              totalPages={totalPages}
              pageSize={pageSize}
              selectPage={changePage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardTable;
