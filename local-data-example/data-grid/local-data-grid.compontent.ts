import { Component } from "@angular/core";
import {
  ActionControl,
  BuiltInActionType,
  BulkActionControl,
  Column,
  ColumnDataType,
  Pagination,
} from "@c8y/ngx-components";
import { createMockedData, ExampleStructure } from "./data";

@Component({
  selector: "local-data-grid",
  templateUrl: "./local-data-grid.component.html",
})
export class LocalDataGridComponent {
  columns: Column[];
  rows: ExampleStructure[];

  pagination: Pagination = {
    pageSize: 30,
    currentPage: 1,
  };

  actionControls: ActionControl[] = [
    {
      type: BuiltInActionType.Delete,
      callback: (item) => console.log(`deleted item id: ${item.id}`),
    },
    {
      type: BuiltInActionType.Edit,
      callback: (item) => console.log(`edited item id: ${item.id}`),
    },
  ];
  bulkActionControls: BulkActionControl[] = [
    {
      type: BuiltInActionType.Export,
      callback: (selectedItemIds) =>
        console.log(`exported item ids: ${selectedItemIds}`),
    },
    {
      type: BuiltInActionType.Delete,
      callback: (selectedItemIds) =>
        console.log(`deleted item ids: ${selectedItemIds}`),
    },
  ];

  constructor() {
    this.columns = this.getDefaultColumns();
    this.rows = createMockedData(100);
  }

  getDefaultColumns(): Column[] {
    return [
      { name: "id", header: "ID", path: "id" },
      {
        name: "name",
        header: "Name",
        path: "name",
        filterable: true,
      },
      {
        header: "Temperature",
        name: "temperature",
        sortable: true,
        filterable: true,
        path: "temperature",
        dataType: ColumnDataType.Numeric,
      },
    ];
  }

  handleItemsSelect(selectedItemIds: string[]): void {
    console.log(`selected item ids: ${selectedItemIds}`);
  }
}
