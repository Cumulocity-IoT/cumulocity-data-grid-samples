import { Injectable } from '@angular/core';

import { InventoryService } from '@c8y/client';
import { Column, DataSourceModifier, ServerSideDataResult } from '@c8y/ngx-components';
import {
  CustomColumn,
  hasSearchableConfig,
  hasSortingConfig,
  SearchColumn,
} from '../models/data-grid.model';
import { isEmpty } from 'lodash-es';
import { BaseInventoryDatasourceService } from './base-inventory-datasource.service';

@Injectable({ providedIn: 'root' })
export class InventoryDatasourceService extends BaseInventoryDatasourceService {
  constructor(inventoryService: InventoryService) {
    super(inventoryService);
  }

  async reload(
    dataSourceModifier: DataSourceModifier,
    baseQuery: object
  ): Promise<ServerSideDataResult> {
    const { columns, pagination, searchText } = dataSourceModifier;
    const filterQuery = this.createQueryJSON(columns, baseQuery)
      .addFilterAttribute(this.createSearchJSON(columns, searchText))
      .addOrderBys(this.createOrderBySortingConfig(columns))
      .toString();
    const allQuery = this.createQueryJSON([], baseQuery).toString();

    const mosForPage = this.fetchManagedObjectsForPage(filterQuery, pagination);
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

  private createOrderBySortingConfig(columns: Column[]) {
    const orderBys: { [key: string]: 1 | -1 }[] = [];

    const customColumns: CustomColumn[] = columns.filter(
      (c) => hasSortingConfig(c) && !isEmpty(c.sortingConfig?.pathSortingConfigs)
    );
    for (const c of customColumns) {
      const sortOrder = c.sortOrder === 'asc' ? 1 : -1;
      for (const config of c.sortingConfig.pathSortingConfigs) {
        orderBys.push({
          [config.path]: sortOrder,
        });
      }
    }
    return orderBys;
  }

  private createSearchJSON(columns: Column[], search: string): object {
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
    return orFilter;
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
}
