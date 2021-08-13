import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule, HOOK_NAVIGATOR_NODES, NavigatorNode } from '@c8y/ngx-components';
import { CustomFilterGridComponent } from './custom-filter-grid.component';
import { DateFilterRendererComponent } from './custom-filters/date-filter-renderer.component';
import { NumberFilterRendererComponent } from './custom-filters/number-filter-renderer.component';

const routes: Routes = [
  {
    path: 'custom-filter-example',
    component: CustomFilterGridComponent,
  },
];

const dataGridNavigation = new NavigatorNode({
  label: 'Custom Filter Example',
  icon: 'table',
  priority: 2,
  path: 'custom-filter-example',
});

@NgModule({
  declarations: [CustomFilterGridComponent, DateFilterRendererComponent, NumberFilterRendererComponent],
  entryComponents: [DateFilterRendererComponent, NumberFilterRendererComponent],
  imports: [CoreModule, RouterModule.forChild(routes)],
  providers: [
    {
      provide: HOOK_NAVIGATOR_NODES,
      useValue: { get: () => dataGridNavigation },
      multi: true,
    },
  ],
})
export class CustomFilterExampleModule {}
