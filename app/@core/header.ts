import { RequestOptions, Headers } from '@angular/http';
import { URLSearchParams } from '@angular/http';
export class Header {
  private headers:Headers
  private options:RequestOptions = new RequestOptions({ headers: this.headers });
  private params;
  constructor(
  ) {
      this.headers = this.getHeaders();
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('origen_datos', 'PEB2M');
    headers.append('tipo_empresa', localStorage.getItem('tipo_empresa') )
    headers.append('org_id', localStorage.getItem('org_id'));    
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    headers.append("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
    return headers;
  } 

  private setParams(arrayParams:any){
    let params = new URLSearchParams();
    arrayParams.forEach(element => {
      params.append(element.param, element.value);
    });
    return params;
  }

  public getOptions(arrayParams:any){
    return this.options = new RequestOptions({ headers: this.headers, params: this.setParams(arrayParams) });
  }
}
