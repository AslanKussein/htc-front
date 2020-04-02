import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Util {

  constructor() {
  }

  isNullOrEmpty(e: any) {
    return e == null || e == '' || e == undefined;
  }
}
