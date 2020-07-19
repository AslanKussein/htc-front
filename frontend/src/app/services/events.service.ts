import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {EventsDTO} from "../models/eventsDTO";
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  /**
   * @desc addEvent;
   * @param dto
   */
  addEvent(dto: EventsDTO): Observable<any> {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/events`, dto)
      .pipe(tap(), catchError(EventsService.handleError));
  }

  /**
   * @desc getEventById;
   * @param id
   */
  getEventById(id: number): Observable<any> {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/events/` + id, {})
      .pipe(tap(), catchError(EventsService.handleError));
  }

  /**
   * @desc updateEvent;
   * @param id
   * @param dto
   */
  updateEvent(id: number, dto: EventsDTO): Observable<any> {
    return this.http.put<any>(`${this.configService.apiDataManagerUrl}/api/events/` + id, dto)
      .pipe(tap(), catchError(EventsService.handleError));
  }

  /**
   * @desc deleteEventById;
   * @param id
   */
  deleteEventById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.configService.apiDataManagerUrl}/api/events/` + id, {})
      .pipe(tap(), catchError(EventsService.handleError));
  }

  getEventsForCalendar(searchFilter: any) {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/api/events/eventsForCalendar`, searchFilter)
      .pipe(tap(), catchError(EventsService.handleError));
  }

  getEventsByDate(date: any) {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/api/events/eventsToDate`, {date})
      .pipe(tap(), catchError(EventsService.handleError));
  }

  getEventsByApplicationId(searchParams: any) {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/api/events/applicationEvents`, searchParams)
      .pipe(tap(), catchError(EventsService.handleError));
  }

  putCommentEvent(id: number, comment: string) {
    return this.http.put<any>(`${this.configService.apiDataManagerUrl}/api/events/` + id + `/comment`, comment)
      .pipe(tap(), catchError(EventsService.handleError));
  }

  getContractsInfo(id: number) {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/events/getContractsInfo/` + id)
      .pipe(tap(), catchError(EventsService.handleError));
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
