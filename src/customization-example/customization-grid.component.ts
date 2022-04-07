import { Component, EventEmitter } from '@angular/core';
import { IManagedObject, InventoryService } from '@c8y/client';
import {
  ActionControl,
  AlertService,
  Column,
  ColumnDataType,
  gettext,
  LoadMoreMode,
  ModalService,
  Pagination,
  Status,
  Row,
  BuiltInActionType,
  BulkActionControl,
  GridConfig,
} from '@c8y/ngx-components';
import { TranslateService } from '@ngx-translate/core';
import { CustomColumn } from 'src/models/data-grid.model';
import { GridConfigCacheService } from '../services/grid-config-cache.service';
import { DevicesDatasourceService } from '../services/devices-datasource.service';
import { AlarmsCellRendererComponent } from './cell-renderer/alarms.cell-renderer.component';
import { DateFilterRendererComponent } from './custom-filters/date-filter-renderer.component';

@Component({
  providers: [DevicesDatasourceService],
  selector: 'customization-grid',
  templateUrl: './customization-grid.component.html',
})
export class CustomizationGridComponent {
  mode: LoadMoreMode = 'show';

  /** The label for load more button. */
  loadMoreItemsLabel = gettext('Load more devices');
  /** The label for loading indicator. */
  loadingItemsLabel = gettext('Loading devices…');

  /** Takes an event emitter. When an event is emitted, the grid will be reloaded. */
  refresh = new EventEmitter<any>();

  columns: Column[];
  pagination: Pagination;
  actionControls: ActionControl[] = [
    {
      type: BuiltInActionType.Delete,
      callback: (device: Row) => this.onDeleteDevice(device as IManagedObject),
    },
  ];
  bulkActionControls: BulkActionControl[] = [
    {
      type: BuiltInActionType.Delete,
      callback: (deviceIds: string[]) => this.onDeleteDevicesBulk(deviceIds),
    },
  ];

  readonly GRID_CONFIG_CACHE_KEY = 'custom-filter-config';

  constructor(
    protected devicesDataSource: DevicesDatasourceService,
    protected alertService: AlertService,
    protected modal: ModalService,
    protected translateService: TranslateService,
    private inventoryService: InventoryService,
    private configCacheService: GridConfigCacheService
  ) {
    this.columns = this.configCacheService.getUserConfiguredColumns(
      this.GRID_CONFIG_CACHE_KEY,
      this.getDefaultColumns()
    );
    this.pagination = this.configCacheService.getUserConfiguredPagination(
      this.GRID_CONFIG_CACHE_KEY
    ) ?? this.getDefaultPagination();
  }

  getDefaultPagination(): Pagination {
    return { currentPage: 1, pageSize: 30 };
  }

  getDefaultColumns(): CustomColumn[] {
    return [
      {
        name: 'id',
        header: gettext('ID'),
        path: 'id',
      },
      {
        name: 'name',
        header: gettext('Name'),
        path: 'name',
        filterable: true,
      },
      {
        header: 'Alarms',
        name: 'alarms',
        cellRendererComponent: AlarmsCellRendererComponent,
        gridTrackSize: '1fr',
        sortable: true,
        sortingConfig: {
          pathSortingConfigs: [
            { path: 'c8y_ActiveAlarmsStatus.critical' },
            { path: 'c8y_ActiveAlarmsStatus.major' },
            { path: 'c8y_ActiveAlarmsStatus.minor' },
            { path: 'c8y_ActiveAlarmsStatus.warning' },
          ],
        },
      },
      {
        name: 'lastMessage',
        header: gettext('Last Message'),
        path: 'c8y_Availability.lastMessage',
        filterable: true,
        dataType: ColumnDataType.TextShort,
        filteringFormRendererComponent: DateFilterRendererComponent,
      },
      {
        header: gettext('Last Updated'),
        name: 'lastUpdated',
        filterable: true,
        path: 'lastUpdated',
        dataType: ColumnDataType.TextShort,
        filteringFormRendererComponent: DateFilterRendererComponent,
      },
    ];
  }

  async onDeleteDevice(row: Row) {
    const device = row as IManagedObject;
    try {
      await this.modal.confirm(
        gettext('Delete device'),
        this.translateService.instant(
          gettext(`You are about to delete device: "{{ name }}". Do you want to proceed?`),
          { name: device.name }
        ),
        Status.DANGER,
        { ok: gettext('Delete'), cancel: gettext('Cancel') }
      );
      await this.inventoryService.delete(device);
      this.alertService.success(gettext('Device deleted.'));
      // reload the grid to remove the just deleted item
      this.refresh.next();
    } catch (ex) {
      // only if not cancel from modal
      if (ex) {
        this.alertService.addServerFailure(ex);
      }
    }
  }

  async onDeleteDevicesBulk(deviceIds: string[]) {
    try {
      await this.modal.confirm(
        gettext('Delete devices'),
        this.translateService.instant(
          gettext(`You are about to delete devices: "{{ devices }}". Do you want to proceed?`),
          { devices: this.getCommaSeparatedIdsString(deviceIds) }
        ),
        Status.DANGER,
        { ok: gettext('Delete'), cancel: gettext('Cancel') }
      );

      const deleteRequests = deviceIds.map((id) => this.inventoryService.delete(id));
      await Promise.all(deleteRequests);
      this.alertService.success(deviceIds.length + ' ' + gettext('devices deleted.'));
      // reload the grid to remove the just deleted item
      this.refresh.next();
    } catch (ex) {
      // only if not cancel from modal
      if (ex) {
        this.alertService.addServerFailure(ex);
      }
    }
  }

  private getCommaSeparatedIdsString(deviceIds: string[]): string {
    return deviceIds.toString().replace(/,/g, ', ');
  }

  onConfigChange(config: GridConfig): void {
    this.configCacheService.saveGridConfig(this.GRID_CONFIG_CACHE_KEY, config);
  }
}
