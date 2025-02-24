import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers });
  }

  postBearer<T>(endpoint: string, data: any): Observable<T> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, { headers });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, { headers });
  }

  patch<T>(endpoint: string): Observable<T> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, { headers });
  }
}
