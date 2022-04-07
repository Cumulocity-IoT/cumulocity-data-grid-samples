import { Injectable } from '@angular/core';

import { DataSourceModifier, ServerSideDataResult } from '@c8y/ngx-components';
import { InventoryDatasourceService } from './inventory-datasource.service';

@Injectable()
export class DevicesDatasourceService {
  serverSideDataCallback: Promise<ServerSideDataResult>;

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
    return this.inventoryDatasource.reload(dataSourceModifier, this.BASE_QUERY);
  }
}
