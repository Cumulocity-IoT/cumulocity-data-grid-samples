import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Column, FilteringFormRendererContext } from '@c8y/ngx-components';

type PickedDates = {
  dateFrom: string | null;
  dateTo: string | null;
};

@Component({
  templateUrl: './date-filter-renderer.component.html',
})
export class DateFilterRendererComponent implements OnInit {
  dates: PickedDates = {
    dateFrom: null,
    dateTo: null,
  };

  constructor(public context: FilteringFormRendererContext) {}

  ngOnInit() {
    const column = this.context.property;
    const hasFilterSet = !!column.externalFilterQuery;
    if (hasFilterSet) {
      this.writeColumnFilterValuesToView(column);
    }
  }

  /**
   * Updates thew view with the values from the filter.
   * @param column
   */
  private writeColumnFilterValuesToView(column: Column) {
    const columnFilter = column.externalFilterQuery[this.getDatePath()];
    if (!columnFilter) {
      return;
    }

    const tuples = Object.entries(columnFilter) as [string, string][];
    const dates: PickedDates = {
      dateFrom: null,
      dateTo: null,
    };
    for (const tuple of tuples) {
      const [queryOperation, dateString] = tuple;
      if (queryOperation === '__ge') {
        dates.dateFrom = this.toInputDateFormat(dateString);
      } else if (queryOperation === '__le') {
        dates.dateTo = this.toInputDateFormat(dateString);
      }
    }
    this.dates = dates;
  }

  /**
   * Converts from yyy-MM-dd to ISO format for c8y.
   * @param inputDateString
   */
  private toQueryDateFormat(inputDateString: string): string {
    return new Date(inputDateString).toISOString();
  }

  /**
   * Converts from ISO format to yyy-MM-dd for date input.
   * @param isoDateString
   */
  private toInputDateFormat(isoDateString: string): string {
    return formatDate(new Date(isoDateString), 'yyyy-MM-dd', 'en-US');
  }

  /**
   * Appends the date attribute to the end of the path.
   * See https://cumulocity.com/guides/reference/inventory/, section Query language
   */
  private getDatePath(): string {
    if (this.context.property.path === 'c8y_Availability.lastMessage') {
      return this.context.property.path;
    }
    return `${this.context.property.path}.date`;
  }

  applyFilter(): void {
    if (!(this.dates.dateFrom || this.dates.dateTo)) {
      return;
    }

    let startOrEndDateFilter = {};
    if (this.dates.dateFrom) {
      startOrEndDateFilter = {
        ...startOrEndDateFilter,
        __ge: this.toQueryDateFormat(this.dates.dateFrom),
      };
    }
    if (this.dates.dateTo) {
      startOrEndDateFilter = {
        ...startOrEndDateFilter,
        __le: this.toQueryDateFormat(`${this.dates.dateTo} 23:59:59`),
      };
    }
    const filter = {
      [this.getDatePath()]: startOrEndDateFilter,
    };

    this.context.applyFilter({
      externalFilterQuery: filter,
    });
  }

  resetFilter(): void {
    this.context.resetFilter();
  }
}
