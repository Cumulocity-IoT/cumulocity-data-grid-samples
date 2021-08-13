import { Injectable } from '@angular/core';

import { Column, DataSourceModifier, Pagination, ServerSideDataResult } from '@c8y/ngx-components';
import { MeasurementsDatasourceService } from './measurements-datasource.service';

@Injectable()
export class AllMeasurementsDatasourceService {
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
    dateFrom: new Date(0).toISOString(),
    dateTo: new Date().toISOString(),
    revert: true,
  };

  constructor(private measurementDataSource: MeasurementsDatasourceService) {
    this.serverSideDataCallback = this.onDataSourceModifier.bind(this);
  }

  async onDataSourceModifier(
    dataSourceModifier: DataSourceModifier
  ): Promise<ServerSideDataResult> {
    this.columns = [...(dataSourceModifier.columns || [])];
    return this.measurementDataSource.reload(dataSourceModifier, this.BASE_QUERY);
  }
}
