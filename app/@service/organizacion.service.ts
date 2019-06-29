import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Header } from 'app/@core/header';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Organizacion } from "app/model/administracion/organizacion";
import { AdministracionTopic } from "app/@model/administracion/AdministracionTopic";
import { URI_ADMIN_LISTA, URI_ADMIN_CREAR } from "app/utils/app.constants";

@Injectable()
export class OrganizacionService {
  private header:Header;
  private administracionTopic:AdministracionTopic;
  constructor(
    private http: Http, 
    private httpClient: HttpClient
  ) {
      this.header = new Header();
      this.administracionTopic = new AdministracionTopic();
      this.administracionTopic.Topic = 'organizacion';
  }

  public obtenerListaOrganizacion(arrayParams:any){
    return this.http.get(URI_ADMIN_LISTA + 'organizacion/', this.header.getOptions(arrayParams))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public obtenerOrganizacionPorId(id: string ): Observable <Organizacion> {
    return this.http
      .get(URI_ADMIN_LISTA + 'organizacion/' + id, this.header.getOptions([]))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public crearOrganizacion(organizacion: Organizacion) {
    this.administracionTopic.Objeto = organizacion;
    return this.http.post(URI_ADMIN_CREAR, this.administracionTopic, this.header.getOptions([]))
      .catch(this.handleError);
  }

  public editarOrganizacion(organizacion: Organizacion) {
    this.administracionTopic.Objeto = organizacion;
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
