import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CityDto {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private readonly apiUrl = `${environment.apiUrl}/cities`;

  constructor(private http: HttpClient) {}

  getAllCities(): Observable<CityDto[]> {
    return this.http.get<CityDto[]>(this.apiUrl);
  }

  getCityById(id: number): Observable<CityDto> {
    return this.http.get<CityDto>(`${this.apiUrl}/${id}`);
  }
}
