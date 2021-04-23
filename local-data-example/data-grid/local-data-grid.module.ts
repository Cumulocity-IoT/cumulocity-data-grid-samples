import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
  CoreModule,
  HOOK_NAVIGATOR_NODES,
  NavigatorNode,
} from "@c8y/ngx-components";
import { LocalDataGridComponent } from "./local-data-grid.compontent";

const routes: Routes = [
  {
    path: "data-grid",
    component: LocalDataGridComponent,
  },
  {
    path: '',
    redirectTo: 'data-grid',
    pathMatch: 'full'
  }
];

const dataGridNavigation = new NavigatorNode({
  label: "Local Data Grid",
  icon: "table",
  priority: 1,
});

@NgModule({
  declarations: [LocalDataGridComponent],
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
export class LocalDataGridModule { }
