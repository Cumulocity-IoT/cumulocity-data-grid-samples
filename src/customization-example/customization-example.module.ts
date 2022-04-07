import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule, HOOK_NAVIGATOR_NODES, NavigatorNode } from '@c8y/ngx-components';
import { AlarmsCellRendererComponent } from './cell-renderer/alarms.cell-renderer.component';
import { CustomizationGridComponent } from './customization-grid.component';
import { DateFilterRendererComponent } from './custom-filters/date-filter-renderer.component';
import { NumberFilterRendererComponent } from './custom-filters/number-filter-renderer.component';

const routes: Routes = [
  {
    path: 'customization-example',
    component: CustomizationGridComponent,
  },
];

const dataGridNavigation = new NavigatorNode({
  label: 'Customization Example',
  icon: 'table',
  priority: 2,
  path: 'customization-example',
});

@NgModule({
  declarations: [
    CustomizationGridComponent,
    DateFilterRendererComponent,
    NumberFilterRendererComponent,
    AlarmsCellRendererComponent
  ],
  entryComponents: [DateFilterRendererComponent, NumberFilterRendererComponent, AlarmsCellRendererComponent],
  imports: [CoreModule, CommonModule, RouterModule.forChild(routes)],
  providers: [
    {
      provide: HOOK_NAVIGATOR_NODES,
      useValue: { get: () => dataGridNavigation },
      multi: true,
    },
  ],
})
export class CustomizationExampleModule {}
