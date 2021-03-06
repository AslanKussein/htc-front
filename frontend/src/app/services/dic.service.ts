import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class DicService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  public getDics(dicName): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/open-api/dictionaries/` + dicName, {})
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public getDicsAllPageable(search): Observable<any> {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/open-api/dictionary/list/pageable`, search)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public getResidentialComplexesPageable(search: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/open-api/residential-complexes/getAllPageable`, search);
  }

  public getResidentialComplexes(): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/open-api/residential-complexes`, {})
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }


  public getResidentialComplexesById(id): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/open-api/residential-complexes/` + id, {})
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }


  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }

  public saveDic(obj, dicName): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/open-api/dictionaries/` + dicName, obj)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public saveDicNew(obj): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/open-api/dictionary`, obj)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public updateDic(obj, dicName): Observable<any> {
    return this.http.put(`${this.configService.apiDataManagerUrl}/open-api/dictionaries/` + dicName + '/' + obj.id, obj)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public updateDicNew(obj, form): Observable<any> {
    return this.http.put(`${this.configService.apiDataManagerUrl}/open-api/dictionary/` + obj.id, form)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public deleteDic(obj, dicName): Observable<any> {
    return this.http.delete(`${this.configService.apiDataManagerUrl}/open-api/dictionaries/` + dicName + '/' + obj.id)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public deleteDicNew(obj, dicName): Observable<any> {
    return this.http.delete(`${this.configService.apiDataManagerUrl}/open-api/dictionary/` + dicName + '/' + obj.id)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public saveResidentalComplex(obj): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/open-api/residential-complexes`, obj)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public updateResidentalComplex(obj): Observable<any> {
    return this.http.put(`${this.configService.apiDataManagerUrl}/open-api/residential-complexes/` + obj.id, obj)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }

  public deleteResidentalComplex(obj): Observable<any> {
    return this.http.delete(`${this.configService.apiDataManagerUrl}/open-api/residential-complexes/` + obj.id)
      .pipe(
        tap(),
        catchError(DicService.handleError)
      );
  }
}
