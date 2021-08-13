import { Component } from '@angular/core';
import { ActionControl, Column, ColumnDataType, Pagination } from '@c8y/ngx-components';
import { DevicesDatasourceService } from '../services/devices-datasource.service';
import { DateFilterRendererComponent } from './custom-filters/date-filter-renderer.component';

@Component({
  providers: [DevicesDatasourceService],
  selector: 'custom-filter-grid',
  templateUrl: './custom-filter-grid.component.html',
})
export class CustomFilterGridComponent {
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
      {
        name: 'id',
        header: 'ID',
        path: 'id',
      },
      {
        name: 'name',
        header: 'Name',
        path: 'name',
        filterable: true,
      },
      {
        name: 'lastMessage',
        header: 'Last Message',
        sortable: true,
        path: 'c8y_Availability.lastMessage',
        filterable: true,
        dataType: ColumnDataType.TextShort,
        filteringFormRendererComponent: DateFilterRendererComponent,
      },
      {
        header: 'Last Updated',
        name: 'lastUpdated',
        sortable: true,
        filterable: true,
        path: 'lastUpdated',
        dataType: ColumnDataType.TextShort,
        filteringFormRendererComponent: DateFilterRendererComponent,
      },
    ];
  }
}
