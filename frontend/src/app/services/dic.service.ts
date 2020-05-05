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
    return this.http.get(`${this.configService.apiDataManagerUrl}/dictionaries/` + dicName, {})
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public getResidentialComplexesPageable(search: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/residential-complexes/getAllPageable`, search);
  }

  public getResidentialComplexes(): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/residential-complexes`, {})
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public getResidentialComplexesPageable(search:any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/residential-complexes/getAllPageable`, search)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public getResidentialComplexesById(id): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/residential-complexes/`+id, {})
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
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

  public saveDic(obj,dicName): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/dictionaries/`+dicName, obj)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public updateDic(obj,dicName): Observable<any> {
    return this.http.put(`${this.configService.apiDataManagerUrl}/dictionaries/`+dicName+'/'+obj.id, obj)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public deleteDic(obj,dicName): Observable<any> {
    return this.http.delete(`${this.configService.apiDataManagerUrl}/dictionaries/`+dicName+'/'+obj.id)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public saveResidentalComplex(obj): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/residential-complexes`, obj)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public updateResidentalComplex(obj): Observable<any> {
    return this.http.put(`${this.configService.apiDataManagerUrl}/residential-complexes/`+obj.id, obj)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  public deleteResidentalComplex(obj): Observable<any> {
    return this.http.delete(`${this.configService.apiDataManagerUrl}/residential-complexes/`+obj.id)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }
}
