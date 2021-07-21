import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as ngRouterModule } from '@angular/router';
import { CoreModule, BootstrapComponent, RouterModule, PluginsModule } from '@c8y/ngx-components';
import { LocalDataGridModule } from './src/local-data-example/local-data-grid.module';
import { RemoteDataGridModule } from './src/remote-data-example/remote-data-grid.module';

@NgModule({
  imports: [
    // Grid example modules
    LocalDataGridModule,
    RemoteDataGridModule,
    // Cumulocity imports
    BrowserAnimationsModule,
    RouterModule.forRoot(),
    ngRouterModule.forRoot([], { enableTracing: false, useHash: true }),
    CoreModule.forRoot(),
    PluginsModule.forRoot()
  ],
  bootstrap: [BootstrapComponent]
})
export class AppModule {}
