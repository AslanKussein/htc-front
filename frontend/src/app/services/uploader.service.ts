import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  public uploadData(selectedFile: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);

    return this.http.post<any>(`${this.configService.apiFileManagerUrl}/upload`, uploadData)
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }


  public getResumePhoto(getPhotoById): Observable<any> {
    // let params = new HttpParams();
    // params = params.append('photoId', String(getPhotoById));

    return this.http.get<any>(`${this.configService.apiFileManagerUrl}//download/` + getPhotoById, {})
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
