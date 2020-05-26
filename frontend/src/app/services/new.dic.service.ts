import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/internal/operators';
import {Dic} from "../models/dic";

@Injectable({
  providedIn: 'root'
})
export class NewDicService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  /**
   * Сохранение справочных данных
   * @param data
   */
  public saveDictionary(data: Dic): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/open-api/dictionary`, data)
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  /**
   * Значение справочника по id
   * @param dicName
   * @param id
   */
  public getDictionaryById(dicName: string, id): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/open-api/dictionary/` + dicName + `/` + id, {})
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  /**
   * Удаление справочных данных
   * @param dicName
   * @param id
   */
  public deleteDictionaryById(dicName: string, id: number): Observable<any> {
    return this.http.delete(`${this.configService.apiDataManagerUrl}/open-api/dictionary/` + dicName + `/` + id, {})
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  /**
   * Список значений по справочнику
   * @param dicName
   */
  public getDictionary(dicName: string): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/open-api/dictionary/` + dicName + `/list`, {})
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  /**
   * Список значений по справочнику по родительскому объекту
   * @param dicName
   * @param parentId
   */
  public getDictionaryByParentId(dicName: string, parentId: number): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/open-api/dictionary/` + dicName + `/list` + parentId, {})
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  /**
   * Обновление справочных данных
   * @param data
   * @param id
   */
  public updateDictionary(data: Dic, id: number): Observable<any> {
    return this.http.put(`${this.configService.apiDataManagerUrl}/open-api/dictionary` + id, data)
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  /**
   * Список всех справочников
   */
  public getAllDic(): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/open-api/dictionary/allDict`, {})
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  /**
   * Список всех справочников с пагинацией
   */
  public getAllDicPageable(searchParams: any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/open-api/dictionary/allDict/pageable`, searchParams)
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  /**
   * Список значений по справочнику с пагинацией
   */
  public getAllListDicPageable(searchParams: any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/open-api/dictionary/list/pageable`, searchParams)
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  public getResidentialComplexesPageable(search: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/residential-complexes/getAllPageable`, search);
  }

  public getResidentialComplexes(): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/api/residential-complexes`, {})
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  public getResidentialComplexesById(id): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/api/residential-complexes/` + id, {})
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  public getResidentialComplexesByPostcode(postcode: string): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/api/residential-complexes/` + postcode, {})
      .pipe(
        tap(),
        catchError(NewDicService.handleError)
      );
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
