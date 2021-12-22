import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule, HOOK_NAVIGATOR_NODES, NavigatorNode } from '@c8y/ngx-components';
import { MinimumDataGridComponent } from './minimum-data-grid.component';

const routes: Routes = [
  {
    path: 'minimum-data-example',
    component: MinimumDataGridComponent,
  },
];

const dataGridNavigation = new NavigatorNode({
  label: 'Minimum Data Example',
  icon: 'table',
  priority: 4,
  path: 'minimum-data-example',
});

@NgModule({
  declarations: [MinimumDataGridComponent],
  entryComponents: [],
  imports: [RouterModule.forChild(routes), CoreModule],
  providers: [
    {
      provide: HOOK_NAVIGATOR_NODES,
      useValue: { get: () => dataGridNavigation },
      multi: true,
    },
  ],
})
export class MinimumDataGridModule {}
