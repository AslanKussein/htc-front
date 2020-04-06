import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';

@Injectable({
    providedIn: 'root'
})
export class DicService {

    constructor(private configService: ConfigService, private http: HttpClient) {
    }

    public getDictionaryByName(name): Observable<any> {
        return this.http.post(`${this.configService.apiUrl}/dic/getDicByName`, {name: name})
      // return this.http.post('/ehr/api/dic/getDicByName', {name: name})
            .pipe(
                tap(data => {} ),
                catchError(this.handleError)
            );
    }

    public branchTree(): Observable<any> {
        return this.http.post<any>(`${this.configService.apiUrl}/dic/getBranchTree`, {});
      // return this.http.post('/ehr/api/dic/getBranchTree', {})
    }

    public getAllDictionaryCreateResume(): Observable<any> {
        return this.http.post(`${this.configService.apiUrl}/dic/getAllDictionaryCreateResume`, {})
      // return this.http.post('/ehr/api/dic/getAllDictionaryCreateResume', {})
            .pipe(
                tap(data => {} ),
                catchError(this.handleError)
            );
    }

    public getPersonByIin(obj): Observable<any> {
        return this.http.post(`${this.configService.apiUrl}/person/getPersonByRn`, obj)
      // return this.http.post('/ehr/api/person/getPersonByRn', obj)
            .pipe(
                tap(data => {console.log(data)} ),
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
}
