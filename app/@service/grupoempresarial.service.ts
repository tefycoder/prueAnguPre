import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Header } from 'app/@core/header';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { GrupoEmpresarial } from "app/@model/administracion/GrupoEmpresarial";
import { AdministracionTopic } from "app/@model/administracion/AdministracionTopic";
import { URI_ADMIN_LISTA, URI_ADMIN_CREAR } from "app/utils/app.constants";

@Injectable()
export class GrupoEmpresarialService {
  private header:Header;
  private administracionTopic:AdministracionTopic;
  constructor(
    private http: Http, 
    private httpClient: HttpClient    
  ) {
      this.header = new Header();
      this.administracionTopic = new AdministracionTopic();
      this.administracionTopic.Topic = 'grupoempresarial';
  }

  public obtenerListaGrupoEmpresarial(arrayParams:any){
    return this.http.get(URI_ADMIN_LISTA + 'grupoempresarial/', this.header.getOptions(arrayParams))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public obtenerGrupoEmpresarialPorId(id: string ): Observable <GrupoEmpresarial> {
    return this.http
      .get(URI_ADMIN_LISTA + 'grupoempresarial/' + id, this.header.getOptions([]))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public crearGrupoEmpresarial(grupoEmpresarial: GrupoEmpresarial) {
    this.administracionTopic.Objeto = grupoEmpresarial;
    return this.http.post(URI_ADMIN_CREAR, this.administracionTopic, this.header.getOptions([]))
      .catch(this.handleError);
  }

  public editarGrupoEmpresarial(grupoEmpresarial: GrupoEmpresarial) {
    this.administracionTopic.Objeto = grupoEmpresarial;
    return this.http.put(URI_ADMIN_CREAR, this.administracionTopic, this.header.getOptions([]))
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
