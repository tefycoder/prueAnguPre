import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Header } from 'app/@core/header';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { URI_ADMIN_LISTA, URI_ADMIN_CREAR } from "app/utils/app.constants";

@Injectable()
export class BotonService {
  private header:Header;
  constructor(
    private http: Http, 
    private httpClient: HttpClient
  ) {
      this.header = new Header();
  }

  public obtenerListaBoton(){
    return this.http.get(URI_ADMIN_LISTA + 'boton/', this.header.getOptions([{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 9999999},
    {'param': 'cabecera', 'value': 'IdBoton,Nombre,Descripcion,Icono,Titulo,Estado'},
    {'param': 'filtro_nombre', 'value': 'Habilitado'},
    {'param': 'filtro_valor', 'value': '1'},
    {'param': 'filtro_tipo', 'value': 'i'},
    {'param': 'orden', 'value': 'Descripcion,ASC'}]))
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * extractData
   * @param response 
   */
  private extractData(response: Response) {
    let body = response.json();
    return body || {};
  }
  /**
   * handleError
   * @param error 
   */
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  } 
}
