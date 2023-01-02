import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule, HOOK_NAVIGATOR_NODES, NavigatorNode } from '@c8y/ngx-components';
import { RemoteSearchDataGridComponent } from './remote-data-search-grid.compontent';

const routes: Routes = [
  {
    path: 'remote-data-search-example',
    component: RemoteSearchDataGridComponent,
  },
];

const dataGridNavigation = new NavigatorNode({
  label: 'Remote Search Example',
  icon: 'table',
  priority: 2,
  path: 'remote-data-search-example',
});

@NgModule({
  declarations: [RemoteSearchDataGridComponent],
  entryComponents: [],
  imports: [CoreModule, RouterModule.forChild(routes)],
  providers: [
    {
      provide: HOOK_NAVIGATOR_NODES,
      useValue: { get: () => dataGridNavigation },
      multi: true,
    },
  ],
})
export class RemoteSearchDataGridModule {}
