import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private baseUrl: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getCountryByRegion(region: string): Observable<PaisSmall[]> {
    const url = `${this.baseUrl}/region/${region}?fields=cca3,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getCountryByCode(code: string): Observable<Pais[] | null> {
    if (!code) {
      return of(null);
    }

    const url = `${this.baseUrl}/alpha/${code}`;
    return this.http.get<Pais[]>(url);
  }

  getCountryByCodeSmall(code: string): Observable<PaisSmall> {
    const url = `${this.baseUrl}/alpha/${code}?fields=cca3,name`;
    return this.http.get<PaisSmall>(url);
  }

  getCountriesByCode(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones : Observable<PaisSmall>[] = []

    borders.forEach(code => {
      const peticion = this.getCountryByCodeSmall(code);
      peticiones.push(peticion)
    });

    return combineLatest( peticiones );
  }
}
