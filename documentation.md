## Intro

The project consist of 2 main modules:

- Authentication
- Dashboard

Authentication works with MSAL library and AAD flow.

Auth config: `auth-configuration.ts`

## UI

- At the beginning, the first developer added material UI library that is not suited to final design. I put all
  overwritten styles to the `material-override.scss` file.

- Finally, it is not a good way of redefining styles like this, but some types of components (e.g. tabs) can't be customised in
  other way.

## Server Data Format

Basically, all responses from server come in the format that is not suitable for JS ecosystem.
I created. 

## Dashboard

Dashboard represents table with:

- Pagination
- Searching
- Sorting
- Filtering

## Filters

Each filter represents unique set of data. All filters except tumour primary and tumour sub type _are not related
between each other_.

At the beginning, I built filters factory which returns a set of filters with the required logic. But the design is much
different that's why I started to consider each filter as a separate component. There can be some repeated code and it
need to be refactored. Please, check todos before continuing development. ata-transformer` service to solve this problem.