import { Injectable } from '@angular/core';
import { AppStateService, Column, GridConfig, Pagination } from '@c8y/ngx-components';
import { filter } from 'rxjs/operators';

const GRID_PREFIX = 'c8y-grid-';

@Injectable({ providedIn: 'root' })
export class GridConfigCacheService {
  constructor(appState: AppStateService) {
    appState.currentUser.pipe(filter((user) => user === null)).subscribe(() => this.clear());
  }

  getUserConfiguredColumns(key: string, columns: Column[]): Column[] {
    const config: GridConfig | null = this.getObject(key);
    if (config?.columns?.length) {
      const reOrderedColumns: Column[] = [];
      let noConfigColumns: Column[] = [];
      try {
        noConfigColumns = columns.filter((col) => !config.columns.includes(col));
        config.columns.forEach(({ visible, name, sortOrder }) => {
          const columnToReorder = columns.find((col) => col.name === name);
          if (columnToReorder) {
            columnToReorder.visible = visible;
            columnToReorder.sortOrder = sortOrder;
            reOrderedColumns.push(columnToReorder);
          }
        });
      } catch (ex) {
        this.clear();
      }
      return [...reOrderedColumns, ...noConfigColumns];
    }
    return columns;
  }

  getUserConfiguredPagination(key: string): Pagination | null {
    const config: GridConfig | null = this.getObject(key);
    return config?.pagination ?? null;
  }

  saveGridConfig(key: string, config: GridConfig): void {
    this.setObject(key, config);
  }

  private get(key: string): string | null {
    return sessionStorage.getItem(GRID_PREFIX + key);
  }

  private setObject(key: string, value: any): void {
    this.set(key, JSON.stringify(value));
  }

  private getObject<T>(key: string): T | null {
    const item = this.get(key);
    if (item) {
      return JSON.parse(item) as T;
    }
    return null;
  }

  /**
   * Saves the key-value pair if value is not null.
   * If the value is null or undefined, the entry is removed from the cache.
   * @param key
   * @param value
   */
  private set(key: string, value: string | boolean) {
    if (value == null) {
      sessionStorage.removeItem(GRID_PREFIX + key);
    } else {
      sessionStorage.setItem(GRID_PREFIX + key, value.toString());
    }
  }

  /**
   * Validates if the given key exists in the storage.
   * If yes, removes the item from the cache and returns true.
   * Returns false otherwise.
   * @param key
   * @returns
   */
  private remove(key: string): boolean {
    if (this.has(key)) {
      sessionStorage.removeItem(GRID_PREFIX + key);
      return true;
    }
    return false;
  }

  /**
   * Removes all items set by this service.
   */
  private clear() {
    this.getGridKeys().forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }

  private has(key: string): boolean {
    return this.getGridKeys().includes(GRID_PREFIX + key);
  }

  /**
   * Returns all keys starting with the grid prefix.
   * @returns
   */
  private getGridKeys(): string[] {
    const keys: string[] = [];
    for (var i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(GRID_PREFIX)) {
        keys.push(key);
      }
    }
    return keys;
  }
}
