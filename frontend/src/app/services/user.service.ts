import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
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
      tap(),
      catchError(UserService.handleError)
    );
  }

  findAgentByLogin(login: string): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/users/info?locale=RU&login=` + login, {}).pipe(
      tap(),
      catchError(UserService.handleError)
    );
  }

  /**
   * getAgents
   */
  getAgents(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/agents`, {}).pipe(
      tap(),
      catchError(UserService.handleError)
    );
  }

  getAgentsToAssign(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiViewManagerUrl}/api/agents/getAgentsToAssign`, {}).pipe(
      tap(),
      catchError(UserService.handleError)
    );
  }

  createUserClient(dto: ClientDto) {
    return this.http.post<any>(`${this.configService.apiUserManagerUrl}/api/profile-client`, dto).pipe(
      tap(),
      catchError(UserService.handleError)
    );
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
