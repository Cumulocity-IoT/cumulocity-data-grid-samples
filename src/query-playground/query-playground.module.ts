import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule, HOOK_NAVIGATOR_NODES, NavigatorNode } from '@c8y/ngx-components';
import { QueryPlaygroundComponent } from './query-playground.component';

const routes: Routes = [
  {
    path: 'query-playground',
    component: QueryPlaygroundComponent,
  },
];

const dataGridNavigation = new NavigatorNode({
  label: 'Query Playground',
  icon: 'diamond',
  priority: 5,
  path: 'query-playground',
});

@NgModule({
  declarations: [QueryPlaygroundComponent],
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
export class QueryPlaygrounModule {}
