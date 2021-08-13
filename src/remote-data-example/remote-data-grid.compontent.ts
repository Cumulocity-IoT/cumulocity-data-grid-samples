import { Component } from '@angular/core';
import { ActionControl, Column, Pagination } from '@c8y/ngx-components';
import { DevicesDatasourceService } from '../services/devices-datasource.service';

@Component({
  providers: [DevicesDatasourceService],
  selector: 'remote-data-grid',
  templateUrl: './remote-data-grid.component.html',
})
export class RemoteDataGridComponent {
  columns: Column[];

  pagination: Pagination = {
    pageSize: 30,
    currentPage: 1,
  };

  actionControls: ActionControl[] = [];

  constructor(public devicesDataSource: DevicesDatasourceService) {
    this.columns = this.getDefaultColumns();
  }

  getDefaultColumns(): Column[] {
    return [
      { name: 'id', header: 'ID', path: 'id' },
      {
        name: 'name',
        header: 'Name',
        path: 'name',
        filterable: true,
      },
    ];
  }
}
