import { Injectable } from '@angular/core';

export type NumberComparator = '=' | '>' | '>=' | '<' | '<=';

export type NumberViewModel = {
  value: number | null;
  symbol: NumberComparator;
  path: string;
};

@Injectable()
export class NumberQueryService {
  readonly symbols: NumberComparator[] = ['=', '>', '>=', '<', '<='];

  parseView(vm: NumberViewModel): object {
    const operation = this.mapSymbolToQueryOperation(vm.symbol);
    const filter = {
      [vm.path]: {
        [operation]: vm.value,
      },
    };
    return filter;
  }

  mapSymbolToQueryOperation(symbol: NumberComparator): string {
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

  mapQueryToSymbol(queryOperation: string): NumberComparator {
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
}
