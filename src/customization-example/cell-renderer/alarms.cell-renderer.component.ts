import { Component } from "@angular/core";
import { CellRendererContext } from "@c8y/ngx-components";

@Component({
  templateUrl: "./alarms.cell-renderer.component.html",
})
export class AlarmsCellRendererComponent {
  constructor(public context: CellRendererContext) {}
}
