import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'StringValue'
})
export class EnumPipe implements PipeTransform {
  transform(value:any,enumerable:any) {
    return enumerable[value];
  }
}
