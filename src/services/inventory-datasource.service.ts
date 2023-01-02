import { Injectable } from '@angular/core';

import { InventoryService, IResultList, IManagedObject, QueriesUtil } from '@c8y/client';
import { Column, DataSourceModifier, Pagination, ServerSideDataResult } from '@c8y/ngx-components';
import { hasSearchableConfig, hasSortingConfig, SearchColumn } from '../models/data-grid.model';
import { isEmpty } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class InventoryDatasourceService {
  private readonly queriesUtil = new QueriesUtil();

  constructor(private inventoryService: InventoryService) {}

  async reload(
    dataSourceModifier: DataSourceModifier,
    baseQuery: object
  ): Promise<ServerSideDataResult> {
    const filterQuery = this.createQueryFilter(dataSourceModifier.columns, baseQuery, dataSourceModifier.searchText);
    const allQuery = this.createQueryFilter([], baseQuery, '');

    const mosForPage = this.fetchManagedObjectsForPage(filterQuery, dataSourceModifier.pagination);
    const filtered = this.fetchManagedObjectsCount(filterQuery);
    const total = this.fetchManagedObjectsCount(allQuery);
    const [managedObjects, filteredSize, size] = await Promise.all([mosForPage, filtered, total]);

    const result: ServerSideDataResult = {
      size,
      filteredSize,
      ...managedObjects,
    };

    return result;
  }

  fetchManagedObjectsForPage(
    query: object,
    pagination: Pagination
  ): Promise<IResultList<IManagedObject>> {
    const filters = {
      ...query,
      withParents: true,
      pageSize: pagination.pageSize,
      currentPage: pagination.currentPage,
      withTotalPages: false,
    };
    return this.inventoryService.list(filters);
  }

  /**
   * Returns the complete count of items. Use wisely ond only if really necessary as the calculation of the count is expensive on server-side.
   * @param query
   */
  fetchManagedObjectsCount(query: object): Promise<number> {
    const filters = {
      ...query,
      pageSize: 1,
      currentPage: 1,
      withTotalPages: true,
    };
    return this.inventoryService
      .list(filters)
      .then((result) => (result.paging !== undefined ? result.paging.totalPages : 0));
  }

  createQueryFilter(columns: Column[], baseQuery: object, search: string): { query: string } {
    const query = columns.reduce(this.extendQueryByColumn, {
      __filter: baseQuery,
      __orderby: [],
    });

    if (search) {
      this.extendQueryBySearchableColumnSearch(query, columns, search);
    }

    const queryString = this.queriesUtil.buildQuery(query);
    return { query: queryString };
  }

  extendQueryByColumn = (query: any, column: Column) => {
    if (column.filterable && column.filterPredicate && column.path) {
      const queryObj: any = {};
      queryObj[column.path] = column.filterPredicate;
      query.__filter = { ...query.__filter, ...queryObj };
    }

    if (column.filterable && column.externalFilterQuery) {
      query.__filter = { ...query.__filter, ...column.externalFilterQuery };
    }

    if (column.sortable && column.sortOrder) {
      const sortOrder = column.sortOrder === 'asc' ? 1 : -1;

      if (
        hasSortingConfig(column) &&
        column.sortingConfig &&
        !isEmpty(column.sortingConfig.pathSortingConfigs)
      ) {
        column.sortingConfig.pathSortingConfigs.forEach((config) => {
          this.addSortationToQuery(query, config.path, sortOrder);
        });
      } else if (column.path) {
        this.addSortationToQuery(query, column.path, sortOrder);
      }
    }

    return query;
  };

  private extendQueryBySearchableColumnSearch(query: any, columns: Column[], search: string): void {
    if (!search || !search.length) {
      return;
    }

    const text = `*${isNaN(+search) ? this.caseInsensitivify(search) : search}*`;
    const orArray: object[] = [];
    columns
      .filter((column) => hasSearchableConfig(column) && column.searchable)
      .forEach((column: SearchColumn) => {
        orArray.push({ __eq: { [column.path]: text } });
      });

    const orFilter = { __or: orArray };
    query.__filter = { ...query.__filter, ...orFilter };
  }

  private caseInsensitivify(value: string): string {
    let res = '';
    for (let i = 0; i < value.length; i++) {
      const char = value.charAt(i);
      char.match(/[a-z]/i)
        ? (res = res + '[' + char.toLowerCase() + char.toUpperCase() + ']')
        : (res = res + '' + char);
    }
    return res;
  }

  private addSortationToQuery(query: any, path: string, sortOrder: number) {
    const cs: any = {};
    cs[path] = sortOrder;
    query.__orderby.push(cs);
  }
}
