import {
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  createLoader,
  parseAsIsoDate,
  createParser,
} from "nuqs/server";

import { sortSchema } from "~/lib/schemas";

const parseAsSort = createParser({
  parse(queryValue) {
    return sortSchema.parse(queryValue);
  },
  serialize(value) {
    return value;
  },
});

export const videoFiltersSearchParams = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  tags: parseAsArrayOf(parseAsString, ";").withDefault([]),
  sort: parseAsSort.withDefault("newest"),
  dateFrom: parseAsIsoDate,
  dateTo: parseAsIsoDate,
};

export const loadVideoFiltersSearchParams = createLoader(
  videoFiltersSearchParams,
);
