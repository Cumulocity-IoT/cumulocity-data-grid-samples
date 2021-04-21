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
    path: "samples/data-grid",
    component: LocalDataGridComponent,
  },
];

const samples = new NavigatorNode({
  label: "Examples",
  icon: "road",
  priority: 1,
});

samples.add(
  new NavigatorNode({
    label: "Data Grid",
    path: "/samples/data-grid",
    icon: "table",
    priority: 1,
  })
);

@NgModule({
  declarations: [LocalDataGridComponent],
  entryComponents: [],
  imports: [RouterModule.forChild(routes), CoreModule],
  providers: [
    {
      provide: HOOK_NAVIGATOR_NODES,
      useValue: { get: () => samples },
      multi: true,
    },
  ],
})
export class LocalDataGridModule {}
