export const GENES_SEARCH_INPUT = {
  name: "GENES_SEARCH_INPUT",
  selector: '[name="GENES_SEARCH_INPUT"]',
  fn: `
    function () {
      var GENES_SEARCH_INPUT = document.querySelector('[name="GENES_SEARCH_INPUT"]');
      return GENES_SEARCH_INPUT.value || ""
    }
  `
}