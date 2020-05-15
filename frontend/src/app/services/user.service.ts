import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {ClientDto} from "../models/createClaim/clientDto";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  /**
   * findUserByLogin
   */
  findUserByLogin(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/users/info`, {}).pipe(
      tap(data => {
      }),
      catchError(this.handleError)
    );
  }

  /**
   * getAgents
   */
  getAgents(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/agents`, {}).pipe(
      tap(data => {
      }),
      catchError(this.handleError)
    );
  }

  getAgentsToAssign(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiViewManagerUrl}/agents/getAgentsToAssign`, {}).pipe(
      tap(data => {
      }),
      catchError(this.handleError)
    );
  }

  createUserClient(dto: ClientDto) {
    return this.http.post<any>(`${this.configService.apiUserManagerUrl}/api/profile-client`, dto).pipe(
      tap(data => {
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
    }
    return throwError(
      error);
  }
}
