import { Injectable } from '@angular/core';

import { InventoryService, IResultList, IManagedObject, QueriesUtil } from '@c8y/client';
import { Column, DataSourceModifier, Pagination, ServerSideDataResult } from '@c8y/ngx-components';
import { CustomColumn } from 'src/models/data-grid.model';
import { has, isEmpty } from 'lodash-es';

@Injectable()
export class NoCountInventoryDatasourceService {
  private readonly queriesUtil = new QueriesUtil();

  constructor(private inventoryService: InventoryService) {}

  async reload(
    dataSourceModifier: DataSourceModifier,
    baseQuery: object
  ): Promise<ServerSideDataResult> {
    const filterQuery = this.createQueryFilter(dataSourceModifier.columns, baseQuery);
    const managedObjects = await this.fetchManagedObjectsForPage(
      filterQuery,
      dataSourceModifier.pagination
    );
    const length = managedObjects?.data?.length ?? 0;

    const result: ServerSideDataResult = {
      size: length,
      filteredSize: length,
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

  createQueryFilter(columns: Column[], baseQuery: object): { query: string } {
    const query = columns.reduce(this.extendQueryByColumn, {
      __filter: baseQuery,
      __orderby: [],
    });

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

    if (column.sortOrder) {
      const sortOrder = column.sortOrder === 'asc' ? 1 : -1;

      if (
        this.hasSortingConfig(column) &&
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

  private hasSortingConfig(column: Column): column is CustomColumn {
    return has(column, 'sortingConfig');
  }

  private addSortationToQuery(query: any, path: string, sortOrder: number) {
    const cs: any = {};
    cs[path] = sortOrder;
    query.__orderby.push(cs);
  }
}
