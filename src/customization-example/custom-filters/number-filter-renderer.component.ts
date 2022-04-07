import { Component, OnInit } from '@angular/core';
import { Column, FilteringFormRendererContext } from '@c8y/ngx-components';

type NumberComparator = '=' | '>' | '>=' | '<' | '<=';

type CustomNumberFilter = {
  value: number | null;
  symbol: NumberComparator;
};

@Component({
  templateUrl: './number-filter-renderer.component.html',
})
export class NumberFilterRendererComponent implements OnInit {
  numberFilter: CustomNumberFilter = {
    value: null,
    symbol: '=',
  };
  numberSymbols: NumberComparator[] = ['=', '>', '>=', '<', '<='];
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
    if (!this.context.property.path) {
      return;
    }
    const path = this.context.property.path;
    const columnFilter = column.externalFilterQuery[path];
    if (columnFilter) {
      const tuples = Object.entries(columnFilter) as [string, number][];
      if (tuples.length) {
        const [queryOperation, value] = tuples[0];
        const symbol = this.mapQueryToSymbol(queryOperation);
        this.numberFilter = { symbol, value };
      }
    }
  }

  onDropdownSelect(symbol: NumberComparator): void {
    this.numberFilter.symbol = symbol;
  }

  applyFilter(): void {
    if (!this.context.property.path) {
      return;
    }
    const path = this.context.property.path;
    const operation = this.mapSymbolToQueryOperation(this.numberFilter.symbol);
    const filter = {
      [path]: {
        [operation]: this.numberFilter.value,
      },
    };

    this.context.applyFilter({
      externalFilterQuery: filter,
    });
  }

  private mapSymbolToQueryOperation(symbol: NumberComparator): string {
    switch (symbol) {
      case '<':
        return '__lt';
      case '<=':
        return '__le';
      case '=':
        return '__eq';
      case '>':
        return '__gt';
      case '>=':
        return '__ge';
    }
  }

  private mapQueryToSymbol(queryOperation: string): NumberComparator {
    switch (queryOperation) {
      case '__lt':
        return '<';
      case '__le':
        return '<=';
      case '__eq':
        return '=';
      case '__gt':
        return '>';
      case '__ge':
        return '>=';
    }
    return '=';
  }

  resetFilter(): void {
    this.context.resetFilter();
  }
}
