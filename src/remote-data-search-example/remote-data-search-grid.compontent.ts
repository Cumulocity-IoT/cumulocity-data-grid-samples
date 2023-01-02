import { Component } from '@angular/core';
import { ActionControl, Column, Pagination } from '@c8y/ngx-components';
import { SearchColumn } from 'src/models/data-grid.model';
import { DevicesDatasourceService } from '../services/devices-datasource.service';

@Component({
  providers: [DevicesDatasourceService],
  selector: 'remote-search-grid',
  templateUrl: './remote-data-search-grid.component.html',
})
export class RemoteSearchDataGridComponent {
  columns: Column[];

  pagination: Pagination = {
    pageSize: 30,
    currentPage: 1,
  };

  actionControls: ActionControl[] = [];

  constructor(public devicesDataSource: DevicesDatasourceService) {
    this.columns = this.getDefaultColumns();
  }

  getDefaultColumns(): SearchColumn[] {
    return [
      { name: 'id', header: 'ID', path: 'id', searchable: true },
      {
        name: 'name',
        header: 'Name',
        path: 'name',
        searchable: true,
      },
    ];
  }
}
