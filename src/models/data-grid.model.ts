import { Column } from '@c8y/ngx-components';

export interface CustomColumn extends Column {
  sortingConfig?: ColumnSortingConfig;
}
export type ColumnSortingConfig = {
  pathSortingConfigs: PathSortingConfig[];
};

export interface PathSortingConfig {
  path: string;
  sortOrderModifier?: SortOrderModifier;
}

export const enum SortOrderModifier {
  Keep,
  Invert,
}
