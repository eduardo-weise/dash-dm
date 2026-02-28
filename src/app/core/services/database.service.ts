import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PresenterState } from '../../features/presenter-picker/models/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private readonly databaseUrl = environment.firebase.databaseURL;

  constructor(private http: HttpClient) { }

  read(): Observable<PresenterState> {
    return this.http.get<PresenterState>(`${this.databaseUrl}/data.json`);
  }

  update(state: PresenterState): Observable<void> {
    return this.http.put<void>(`${this.databaseUrl}/data.json`, state);
  }
}
