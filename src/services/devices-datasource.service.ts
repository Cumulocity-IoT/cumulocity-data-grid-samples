import { Injectable } from '@angular/core';

import { Column, DataSourceModifier, Pagination, ServerSideDataResult } from '@c8y/ngx-components';
import { InventoryDatasourceService } from './inventory-datasource.service';

@Injectable()
export class DevicesDatasourceService {
  serverSideDataCallback: Promise<ServerSideDataResult>;
  columns: Column[];

  pagination: Pagination = {
    pageSize: 30,
    currentPage: 1,
  };

  /**
   * The query to be used if the table loads without any column filters.
   */
  private readonly BASE_QUERY = {
    __has: 'c8y_IsDevice',
  };

  constructor(private inventoryDatasource: InventoryDatasourceService) {
    this.serverSideDataCallback = this.onDataSourceModifier.bind(this);
  }

  async onDataSourceModifier(
    dataSourceModifier: DataSourceModifier
  ): Promise<ServerSideDataResult> {
    this.columns = [...(dataSourceModifier.columns || [])];
    return this.inventoryDatasource.reload(dataSourceModifier, this.BASE_QUERY);
  }
}
