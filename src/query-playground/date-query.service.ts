import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

export type DateViewModel = {
  dateFrom: string | null;
  dateTo: string | null;
  path: string;
};

@Injectable()
export class DateQueryService {
  parseView(vm: DateViewModel): object {
    let startOrEndDateFilter = {};
    if (vm.dateFrom) {
      startOrEndDateFilter = {
        ...startOrEndDateFilter,
        __ge: this.toQueryDateFormat(vm.dateFrom),
      };
    }
    if (vm.dateTo) {
      startOrEndDateFilter = {
        ...startOrEndDateFilter,
        __le: this.toQueryDateFormat(`${vm.dateTo} 23:59:59`),
      };
    }
    const filter = {
      [this.appendDatePostfix(vm.path)]: startOrEndDateFilter,
    };

    return filter;
  }

  private appendDatePostfix(path: string): string {
    if (!path || (path && path.includes('date'))) {
      return path || '';
    }

    return `${path}.date`;
  }

  /**
   * Converts from yyy-MM-dd to ISO format for c8y.
   * @param inputDateString
   */
  toQueryDateFormat(inputDateString: string): string {
    return new Date(inputDateString).toISOString();
  }

  /**
   * Converts from ISO format to yyy-MM-dd for date input.
   * @param isoDateString
   */
  toInputDateFormat(isoDateString: string): string {
    return formatDate(new Date(isoDateString), 'yyyy-MM-dd', 'en-US');
  }
}
