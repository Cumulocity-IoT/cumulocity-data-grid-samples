import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule, HOOK_NAVIGATOR_NODES, NavigatorNode } from '@c8y/ngx-components';
import { RemoteDataGridComponent } from './remote-data-grid.compontent';

const routes: Routes = [
  {
    path: 'remote-data-example',
    component: RemoteDataGridComponent,
  },
];

const dataGridNavigation = new NavigatorNode({
  label: 'Remote Data Example',
  icon: 'table',
  priority: 2,
  path: 'remote-data-example',
});

@NgModule({
  declarations: [RemoteDataGridComponent],
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
export class RemoteDataGridModule {}
