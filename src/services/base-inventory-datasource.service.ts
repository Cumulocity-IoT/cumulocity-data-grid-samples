import { Injectable } from '@angular/core';

import { InventoryService, IResultList, IManagedObject, QueriesUtil } from '@c8y/client';
import { Column, Pagination } from '@c8y/ngx-components';
import { cloneDeep } from 'lodash-es';

export interface QueryJSON {
  __filter: any;
  __orderby: { [key: string]: 1 | -1 }[];
}

export class QueryJSON {
  private readonly queriesUtil = new QueriesUtil();
  __filter: any = {};
  __orderby: { [key: string]: 1 | -1 }[] = [];

  constructor(baseQuery?: any) {
    if (baseQuery) {
      this.__filter = cloneDeep(baseQuery);
    }
  }

  toString(): string {
    return this.queriesUtil.buildQuery({ __filter: this.__filter, __orderby: this.__orderby });
  }

  addFilterAttribute(attribute: object) {
    this.__filter = { ...this.__filter, ...attribute };
    return this;
  }

  addOrderBys(orderBys: { [key: string]: 1 | -1 }[]) {
    this.__orderby.push(...orderBys);
    return this;
  }
}

@Injectable({ providedIn: 'root' })
export class BaseInventoryDatasourceService {
  constructor(private inventoryService: InventoryService) {}

  fetchManagedObjectsForPage(
    query: string,
    paging: Pagination
  ): Promise<IResultList<IManagedObject>> {
    const filter = {
      query,
      ...paging,
      withParents: true,
      withTotalPages: false,
    };
    return this.inventoryService.list(filter);
  }

  fetchManagedObjectsCount(query: string): Promise<number> {
    const filter = {
      query,
      pageSize: 1,
      currentPage: 1,
      withTotalPages: true,
    };
    return this.inventoryService.list(filter).then((result) => result.paging.totalPages);
  }

  createQueryJSON(columns: Column[], baseQuery: object = {}): QueryJSON {
    const json = new QueryJSON(baseQuery);
    for (const column of columns) {
      this.extendQueryByColumn(json, column);
    }
    return json;
  }

  extendQueryByColumn = (json: QueryJSON, column: Column) => {
    if (column.filterable) {
      if (typeof column.filterPredicate === 'string' && column.path) {
        json.__filter[column.path] = column.filterPredicate;
      }

      if (column.externalFilterQuery) {
        json.__filter = { ...json.__filter, ...column.externalFilterQuery };
      }
    }

    if (column.sortOrder) {
      const sortOrder: { [key: string]: 1 | -1 } = {
        [column.path]: column.sortOrder === 'asc' ? 1 : -1,
      };
      json.__orderby.push(sortOrder);
    }

    return json;
  };
}
