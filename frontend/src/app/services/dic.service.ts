import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';
import {language} from "../../environments/language";

@Injectable({
  providedIn: 'root'
})
export class DicService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  public getDics(dicName): Observable<any> {
    let url = this.getDicUrl(dicName);
    return this.http.get(`${this.configService.apiDataManagerUrl}/dictionaries/${url}`, {})
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  getDicUrl(name) {
    switch (name) {
      case "operationType":
        return 'operationTypes';
      case "objectType":
        return 'objectTypes';
      case "city":
        return 'cities';
      case "districts":
        return 'districts';
      case "parkingTypes":
        return 'parking-types';
      case "streets":
        return 'streets';
      case "residentialComplexes":
        return 'residentialComplexes';
      case "realProperties":
        return 'real-properties';
      case "propertyOwners":
        return 'property-owners';
      case "possibleReasonForBidding":
        return 'possibleReasonForBidding';
      case "countries":
        return 'countries';
    }
    return null;
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    return throwError(
      error);
  }
}
