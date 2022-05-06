import { Injectable } from '@angular/core';

export enum StringOperator {
  STARTS_WITH = 'Starts with',
  CONTAINS = 'Contains',
  EQUALS = 'Equals',
}

export type StringViewModel = {
  symbol: StringOperator;
  value: string;
  path: string;
};

@Injectable()
export class StringQueryService {
  readonly symbols = [
    StringOperator.STARTS_WITH,
    StringOperator.CONTAINS,
    StringOperator.EQUALS,
  ];

  parseView(vm: StringViewModel): object {
    const filter = {
      [vm.path]: this.mapSymbolToValue(vm.value, vm.symbol),
    };
    return filter;
  }

  private mapSymbolToValue(value: string, symbol: StringOperator) {
    switch (symbol) {
      case StringOperator.STARTS_WITH:
        return `${value}*`;
      case StringOperator.CONTAINS:
        return `*${value}*`;
      case StringOperator.EQUALS:
        return value;
    }
  }
}
