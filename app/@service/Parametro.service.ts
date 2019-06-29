
import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Parametros } from "app/@model/administracion/Parametro";
import { URL_EDITAR_PARAMETROS,URL_PARAMETROS_FACTORING,URL_BUSCAR_PARAMETROS } from 'app/utils/app.constants';
import { Header } from 'app/@core/header';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ParametroService {
    private header:Header;
    
  constructor(
      private http: Http,
      private httpClient:HttpClient
) {
    this.header=new Header();
  }



  public obtenerListaParametro(){
    return this.http.get(URL_PARAMETROS_FACTORING, this.header.getOptions(
        [
            {'param': 'Reglanegocio', 'value': 'FACTORING'},
            {'param': 'column_names', 'value': 'NombreParametro,Idreglaxparametro'},
            
        ]))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public listarRegistroParametro(parametros:any){
    console.log(parametros);
    return this.http.get(URL_BUSCAR_PARAMETROS, this.header.getOptions(parametros))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public crearAprobador(aprobador: Parametros) {
   // this.administracionTopic.Objeto = aprobador;
    return this.http.post(URL_EDITAR_PARAMETROS,aprobador, this.header.getOptions([]))
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
