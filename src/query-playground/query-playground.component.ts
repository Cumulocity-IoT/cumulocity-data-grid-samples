import { Component } from '@angular/core';
import { QueriesUtil } from '@c8y/client';
import { DateQueryService, DateViewModel } from './date-query.service';
import { NumberComparator, NumberQueryService, NumberViewModel } from './number-query.service';
import { StringOperator, StringQueryService, StringViewModel } from './string-query.service';

@Component({
  providers: [StringQueryService, NumberQueryService, DateQueryService],
  templateUrl: './query-playground.component.html',
})
export class QueryPlaygroundComponent {
  stringView: StringViewModel = {
    path: 'name',
    symbol: StringOperator.CONTAINS,
    value: 'device',
  };
  stringSymbols = this.stringQueryService.symbols;
  stringQueryInput = JSON.stringify({
    name: '*device*',
  });
  stringQuery = '';

  numberView: NumberViewModel = {
    value: 10,
    symbol: '>',
    path: 'id',
  };
  numberSymbols = this.numberQueryService.symbols;
  numberQueryInput = JSON.stringify({
    id: {
      __gt: 10,
    },
  });
  numberQuery = '';

  dateView: DateViewModel = {
    dateFrom: this.dateQueryService.toInputDateFormat('2022-05-04T00:00:00.000Z'),
    dateTo: this.dateQueryService.toInputDateFormat('2022-05-05T21:59:59.000Z'),
    path: 'creationTime',
  };
  dateQueryInput = JSON.stringify({
    'creationTime.date': {
      __ge: '2022-05-04T00:00:00.000Z',
      __le: '2022-05-05T21:59:59.000Z',
    },
  });
  dateQuery = '';

  availabilityItems = [
    { name: 'CONNECTED' },
    { name: 'AVAILABLE' },
    { name: 'MAINTENANCE' },
    { name: 'UNAVAILABLE' },
  ];

  availabilityQueryInput = JSON.stringify({
    'c8y_Availability.status': { __in: ['CONNECTED', 'AVAILABLE'] },
  });
  availabilityQuery: string;

  private readonly queriesUtil = new QueriesUtil();

  constructor(
    private stringQueryService: StringQueryService,
    private numberQueryService: NumberQueryService,
    private dateQueryService: DateQueryService
  ) {}

  onStringDropdownSelect(symbol: StringOperator): void {
    this.stringView.symbol = symbol;
  }

  generateStringJSON() {
    const queryJSON = this.stringQueryService.parseView(this.stringView);
    this.stringQueryInput = JSON.stringify(queryJSON);
  }

  createStringQuery(): void {
    try {
      const stringFilter = JSON.parse(this.stringQueryInput);
      this.stringQuery = this.createQuery(stringFilter);
    } catch (e) {
      this.stringQuery = e;
    }
  }

  onNumberDropdownSelect(symbol: NumberComparator): void {
    this.numberView.symbol = symbol;
  }

  generateNumberJSON() {
    const queryJSON = this.numberQueryService.parseView(this.numberView);
    this.numberQueryInput = JSON.stringify(queryJSON);
  }

  createNumberQuery(): void {
    try {
      const numberFilter = JSON.parse(this.numberQueryInput);
      this.numberQuery = this.createQuery(numberFilter);
    } catch (e) {
      this.numberQuery = e;
    }
  }

  generateDateJSON() {
    const queryJSON = this.dateQueryService.parseView(this.dateView);
    this.dateQueryInput = JSON.stringify(queryJSON);
  }

  createDateQuery(): void {
    try {
      const dateFilter = JSON.parse(this.dateQueryInput);
      this.dateQuery = this.createQuery(dateFilter);
    } catch (e) {
      this.dateQuery = e;
    }
  }

  createAvailabilityQuery(): void {
    try {
      const availabilityFilter = JSON.parse(this.availabilityQueryInput);
      this.availabilityQuery = this.createQuery(availabilityFilter);
    } catch (e) {
      this.availabilityQuery = e;
    }
  }

  onUserChangedAvailabilitySelect(items: { name: string }[]): void {
    const stati = items.map((i) => i.name);
    if (stati.length) {
      const filter = {
        ['c8y_Availability.status']: { __in: stati },
      };
      this.availabilityQueryInput = JSON.stringify(filter);
    }
  }

  private createQuery(filter: any): string {
    const query = {
      __filter: filter,
    };

    return this.queriesUtil.buildQuery(query);
  }

  // createQueryFilter(columns: Column[], baseQuery: object): { query: string } {
  //     const query = columns.reduce(this.extendQueryByColumn, {
  //       __filter: baseQuery,
  //       __orderby: [],
  //     });

  //     const queryString = this.queriesUtil.buildQuery(query);
  //     return { query: queryString };
  //   }

  // extendQueryByColumn = (query: any, column: Column) => {
  //     if (column.filterable && column.filterPredicate && column.path) {
  //       const queryObj: any = {};
  //       queryObj[column.path] = column.filterPredicate;
  //       query.__filter = { ...query.__filter, ...queryObj };
  //     }

  //     if (column.filterable && column.externalFilterQuery) {
  //       query.__filter = { ...query.__filter, ...column.externalFilterQuery };
  //     }

  //     if (column.sortable && column.sortOrder) {
  //       const sortOrder = column.sortOrder === 'asc' ? 1 : -1;

  //       if (
  //         this.hasSortingConfig(column) &&
  //         column.sortingConfig &&
  //         !isEmpty(column.sortingConfig.pathSortingConfigs)
  //       ) {
  //         column.sortingConfig.pathSortingConfigs.forEach((config) => {
  //           this.addSortationToQuery(query, config.path, sortOrder);
  //         });
  //       } else if (column.path) {
  //         this.addSortationToQuery(query, column.path, sortOrder);
  //       }
  //     }

  //     return query;
  //   };

  // private addSortationToQuery(query: any, path: string, sortOrder: number) {
  //     const cs: any = {};
  //     cs[path] = sortOrder;
  //     query.__orderby.push(cs);
  //   }
}
