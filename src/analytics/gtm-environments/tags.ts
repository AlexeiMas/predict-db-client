export const PDB_CLICK_TABLE_ROW_MODEL = {
  tag: {
    type: 'Google Analytics: event GA 4',
    configurationTag: 'SAME OF GTM'
  },
  eventName: 'PDB_CLICK_TABLE_ROW_MODEL',
  trigger: {
    name: "CLICK_TABLE_ROW",
    type: "Click - All Elements",
    activation: {
      condition: "Some Clicks",
      rule: "Click Classes contains 'MuiTableCell-root MuiTableCell-body'"
    }
  }
};

export const PDB_SUCCESS_GET_MODEL_DATA = {
  tag: {
    type: 'Google Analytics: event GA 4',
    configurationTag: 'SAME OF GTM'
  },
  eventName: 'PDB_SUCCESS_GET_MODEL_DATA',
  trigger: {
    name: 'MODAL_WINDOW_SHOWS_MODEL_DETAILS',
    type: "Element visibility",
    'Selection method': "ID",
    'Item ID': 'MODEL_DETAILS_VIEW',
    'rule to run this trigger': "once per element",
    registrationOfChangesDom: true,
  }
}