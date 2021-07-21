import { Injectable } from '@angular/core';

import { InventoryService, IResultList, IManagedObject, QueriesUtil } from '@c8y/client';
import { Column, DataSourceModifier, Pagination, ServerSideDataResult } from '@c8y/ngx-components';

@Injectable({ providedIn: 'root' })
export class InventoryDatasourceService {
  private readonly queriesUtil = new QueriesUtil();

  constructor(private inventoryService: InventoryService) {}

  async reload(
    dataSourceModifier: DataSourceModifier,
    baseQuery: object
  ): Promise<ServerSideDataResult> {
    const filterQuery = this.createQueryFilter(dataSourceModifier.columns, baseQuery);
    const allQuery = this.createQueryFilter([], baseQuery);

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

  createQueryFilter(columns: Column[], baseQuery: object): { query: string } {
    const query = columns.reduce(this.extendQueryByColumn, {
      __filter: baseQuery,
      __orderby: [],
    });

    const queryString = this.queriesUtil.buildQuery(query);
    return { query: queryString };
  }

  extendQueryByColumn = (query: any, column: Column) => {
    if (!column.path) {
      return query;
    }

    if (column.filterable && column.filterPredicate) {
      const queryObj: any = {};
      queryObj[column.path] = column.filterPredicate;
      query.__filter = { ...query.__filter, ...queryObj };
    }

    if (column.filterable && column.externalFilterQuery) {
      query.__filter = { ...query.__filter, ...column.externalFilterQuery };
    }

    if (column.sortable && column.sortOrder) {
      const cs: any = {};
      cs[column.path] = column.sortOrder === 'asc' ? 1 : -1;
      query.__orderby.push(cs);
    }

    return query;
  };
}
