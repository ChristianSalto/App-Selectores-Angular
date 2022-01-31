import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor(private fb: FormBuilder, private ps: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.ps.regiones;

    // this.myForm.get('region')?.valueChanges.subscribe((region) => {
    //   this.ps.getCountryByRegion(region).subscribe((paises) => {
    //     this.paises = paises;
    //     console.log(this.paises);
    //   });
    // });

    this.myForm
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.myForm.get('pais')?.reset('');
          this.cargando = true;
          // this.myForm.get('frontera')?.disable();
        }),
        switchMap((region) => this.ps.getCountryByRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    this.myForm
      .get('pais')
      ?.valueChanges.pipe(
        tap((_) => {
          this.myForm.get('frontera')?.reset('');
          // this.myForm.get('frontera')?.enable();
          this.cargando = true;
        }),
        switchMap((code) => this.ps.getCountryByCode(code)),
        switchMap(pais=> this.ps.getCountriesByCode(pais ? pais[0]?.borders : []))
      )
      .subscribe((paises) => {
        // this.fronteras = pais ? pais[0]?.borders : [];
        this.fronteras = paises
        console.log(paises)
        this.cargando = false;
      });
  }

  handleOnSubmit() {
    console.log(this.myForm.value);
  }
}
