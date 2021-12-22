import { Component } from '@angular/core';

@Component({
  template: `<c8y-data-grid
    [columns]="[{ name: 'name', path: 'name' }]"
    [rows]="[{ name: 'Row 1' }, { name: 'Row 2' }, { name: 'Row 3' }]"
    [pagination]="{ pageSize: 5, currentPage: 1 }"
    [actionControls]="[]"
  ></c8y-data-grid>`,
})
export class MinimumDataGridComponent {}
