import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as ngRouterModule } from '@angular/router';
import { CoreModule, BootstrapComponent, RouterModule } from '@c8y/ngx-components';
import { RemoteSearchDataGridModule } from './src/remote-data-search-example/remote-data-search-grid.module';
import { CustomizationExampleModule } from './src/customization-example/customization-example.module';
import { LocalDataGridModule } from './src/local-data-example/local-data-grid.module';
import { MinimumDataGridModule } from './src/minimum-example/minimum-data-grid.module';
import { QueryPlaygrounModule } from './src/query-playground/query-playground.module';
import { RemoteDataGridModule } from './src/remote-data-example/remote-data-grid.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(),
    ngRouterModule.forRoot([], { enableTracing: false, useHash: true }),
    CoreModule.forRoot(),

    LocalDataGridModule,
    MinimumDataGridModule,
    CustomizationExampleModule,
    RemoteDataGridModule,
    RemoteSearchDataGridModule,
    QueryPlaygrounModule,
  ],
  bootstrap: [BootstrapComponent],
})
export class AppModule {}
