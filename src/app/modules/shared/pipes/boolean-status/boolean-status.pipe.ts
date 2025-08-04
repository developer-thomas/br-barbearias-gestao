import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanStatus',
  standalone: true,
})
export class BooleanStatusPipe implements PipeTransform {
  public transform(value?: boolean): string {
    if (value === undefined) {
      return '';
    }
    return value ? 'Ativo' : 'Inativo';
  }
}
