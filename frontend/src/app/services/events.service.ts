import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {EventsDTO} from "../models/eventsDTO";

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
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/events`, dto);
  }

  /**
   * @desc getEventById;
   * @param id
   */
  getEventById(id: number): Observable<any> {
    return this.http.post<any>(`${this.configService.apiDataManagerUrl}/api/events/` + id, {});
  }

  /**
   * @desc updateEvent;
   * @param id
   * @param dto
   */
  updateEvent(id: number, dto: EventsDTO): Observable<any> {
    return this.http.put<any>(`${this.configService.apiDataManagerUrl}/api/events/` + id, dto);
  }

  /**
   * @desc deleteEventById;
   * @param id
   */
  deleteEventById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.configService.apiDataManagerUrl}/api/events/` + id, {});
  }
}
