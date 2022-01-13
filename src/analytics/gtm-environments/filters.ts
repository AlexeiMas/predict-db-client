export const FILTERS_DATA_AVAILABLE = {
  name: "FILTERS_DATA_AVAILABLE",
  selector: "[data-filter='FILTERS_DATA_AVAILABLE']",
  fn: `
    function () {
      var TAGS = document.querySelectorAll("[data-filter='FILTERS_DATA_AVAILABLE']");
      function getTextContent(tag) { return tag.textContent || '' };
      var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
      return !!(values || []).length ? (values || []) : null;
    }
  `
}

export const FILTERS_GENES = {
  GENES: {
    name: "FILTERS_GENES",
    selector: "[data-filter='FILTERS_GENES']",
    fn: `
      function () {
        var TAGS = document.querySelectorAll("[data-filter='FILTERS_GENES']");
        function getTextContent(tag) { return tag.textContent || '' };
        var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
        return !!(values || []).length ? (values || []) : null;
      }
    `
  },
  ALIASES: {
    name: "FILTERS_GENES_ALIASES",
    selector: "[data-filter='FILTERS_GENES_ALIASES']",
    fn: `
      function () {
        var TAGS = document.querySelectorAll("[data-filter='FILTERS_GENES_ALIASES']");
        function getTextContent(tag) { return tag.textContent || '' };
        var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
        return !!(values || []).length ? (values || []) : null;
      }
    `
  },
  PROTEINS: {
    name: "FILTERS_GENES_PROTEINS",
    selector: "[data-filter='FILTERS_GENES_PROTEINS']",
    fn: `
      function () {
        var TAGS = document.querySelectorAll("[data-filter='FILTERS_GENES_PROTEINS']");
        function getTextContent(tag) { return tag.textContent || '' };
        var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
        return !!(values || []).length ? (values || []) : null;
      }
    `
  }
}

export const FILTERS_MODEL_ID = {
  name: "FILTERS_MODEL_ID",
  selector: "[data-filter='FILTERS_MODEL_ID']",
  fn: `
    function () {
      var TAGS = document.querySelectorAll("[data-filter='FILTERS_MODEL_ID']");
      function getTextContent(tag) { return tag.textContent || '' };
      var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
      return !!(values || []).length ? (values || []) : null;
    }
  `
}

export const FILTERS_PDC = {
  name: "FILTERS_PDC",
  selector: "[data-filter='FILTERS_PDC']",
  fn: `
    function () {
      var TAGS = document.querySelectorAll("[data-filter='FILTERS_PDC']");
      function getTextContent(tag) { return tag.textContent || '' };
      var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
      return !!(values || []).length ? (values || []) : null;
    }
  `
};

export const FILTERS_PDC_RESPONSE_TYPE = {
  name: "FILTERS_PDC_RESPONSE_TYPE",
  selector: "[data-filter='FILTERS_PDC_RESPONSE_TYPE']",
  fn: `
    function () {
      var TAGS = document.querySelectorAll("[data-filter='FILTERS_PDC_RESPONSE_TYPE']");
      function getTextContent(tag) { return tag.textContent || '' };
      var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
      return !!(values || []).length ? (values || []) : null;
    }
  `
}

export const FILTERS_PTX = {
  name: "FILTERS_PTX",
  selector: "[data-filter='FILTERS_PTX']",
  fn: `
    function () {
      var TAGS = document.querySelectorAll("[data-filter='FILTERS_PTX']");
      function getTextContent(tag) { return tag.textContent || '' };
      var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
      return !!(values || []).length ? (values || []) : null;
    }
  `
};

export const FILTERS_PTX_RESPONSE_TYPE = {
  name: "FILTERS_PTX_RESPONSE_TYPE",
  selector: "[data-filter='FILTERS_PTX_RESPONSE_TYPE']",
  fn: `
    function () {
      var TAGS = document.querySelectorAll("[data-filter='FILTERS_PTX_RESPONSE_TYPE']");
      function getTextContent(tag) { return tag.textContent || '' };
      var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
      return !!(values || []).length ? (values || []) : null;
    }
  `
}

export const FILTERS_TUMOUR_TYPE = {
  PRIMARY: {
    name: "FILTERS_TUMOUR_TYPE_PRIMARY",
    selector: "[data-filter='FILTERS_TUMOUR_TYPE_PRIMARY']",
    fn: `
      function () {
        var TAGS = document.querySelectorAll("[data-filter='FILTERS_TUMOUR_TYPE_PRIMARY']");
        function getTextContent(tag) { return tag.textContent || '' };
        var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
        return !!(values || []).length ? (values || []) : null;
      }
    `
  },
  SUB: {
    name: "FILTERS_TUMOUR_TYPE_SUB",
    selector: "[data-filter='FILTERS_TUMOUR_TYPE_SUB']",
    fn: `
      function () {
        var TAGS = document.querySelectorAll("[data-filter='FILTERS_TUMOUR_TYPE_SUB']");
        function getTextContent(tag) { return tag.textContent || '' };
        var values = Array.from(TAGS).map(getTextContent).filter(Boolean);
        return !!(values || []).length ? (values || []) : null;
      }
    `
  }
}
