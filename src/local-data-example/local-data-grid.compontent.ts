import { Component } from '@angular/core';
import { Column, ColumnDataType, Pagination } from '@c8y/ngx-components';
import { createMockedData, ExampleStructure } from './data';

@Component({
  selector: 'local-data-grid',
  templateUrl: './local-data-grid.component.html',
})
export class LocalDataGridComponent {
 
  columns: Column[];
  rows: ExampleStructure[];

  pagination: Pagination = {
    pageSize: 30,
    currentPage: 1,
  };

  constructor() {
    this.columns = this.getDefaultColumns();
    this.rows = createMockedData(100);
  }

  getDefaultColumns(): Column[] {
    return [
      { name: 'id', header: 'ID', path: 'id', sortOrder: 'desc' },
      {
        name: 'name',
        header: 'Name',
        path: 'name',
        filterable: true,
      },
      {
        header: 'Temperature',
        name: 'temperature',
        filterable: true,
        path: 'temperature',
        dataType: ColumnDataType.Numeric,
      },
    ];
  }
}
