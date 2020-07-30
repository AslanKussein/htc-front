import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';

@Injectable({
    providedIn: 'root'
})
export class ApplicationNotificationService {

    constructor(private configService: ConfigService, private http: HttpClient) {
    }

    public getAllPageable(params: any): Observable<any> {
        return this.http.post(`${this.configService.apiNotifManagerUrl}/api/notification/getAllPageable`, params)
            .pipe(
                tap(data => {
                }),
                catchError(this.handleError)
            );
    }

    public getAllNotOpenedNotificationCount(): Observable<any> {
        return this.http.get(`${this.configService.apiNotifManagerUrl}/api/notification/all-not-opened/count`, {})
            .pipe(
                tap(data => {
                }),
                catchError(this.handleError)
            );
    }

    public opened(id): Observable<any> {

        return this.http.put(`${this.configService.apiNotifManagerUrl}/api/notification/opened/` + id, {})
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
}
