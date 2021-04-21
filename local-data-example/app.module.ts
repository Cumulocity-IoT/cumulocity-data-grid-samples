import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule as ngRouterModule } from "@angular/router";
import {
  CoreModule,
  BootstrapComponent,
  RouterModule,
} from "@c8y/ngx-components";
import { ProductExperienceModule } from "@c8y/ngx-components/product-experience";
import { LocalDataGridModule } from "./data-grid/local-data-grid.module";

@NgModule({
  imports: [
    LocalDataGridModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(),
    ngRouterModule.forRoot([], { enableTracing: false, useHash: true }),
    CoreModule.forRoot(),
    ProductExperienceModule,
  ],
  bootstrap: [BootstrapComponent],
})
export class AppModule {}
