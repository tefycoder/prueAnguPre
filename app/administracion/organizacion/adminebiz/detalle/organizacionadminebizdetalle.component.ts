import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { OrdenCompra } from "app/model/ordencompra";
import { AdjuntoService } from "app/service/adjuntoservice";
import 'app/../assets/js/plugins/jquery.PrintArea.js';
import { Organizacion } from "app/model/administracion/organizacion";
import { Contrato } from "app/model/administracion/contrato";
import { Modulo } from "app/model/administracion/modulo";
import { ContratoDetalle } from "app/model/administracion/contratodetalle";
import { UiContratoDetalle } from "app/model/administracion/uicontratodetalle";
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from 'app/@components/notify.component';
import { OrganizacionService } from "app/@service/organizacion.service";
import { ModuloService } from "app/@service/modulo.service";
import { UiContratoDetalleService } from "app/@service/uicontratodetalle.service";
import { GrupoEmpresarialService } from "app/@service/grupoempresarial.service";
import { AdmMasterService } from "app/@service/admmaster.service";
import { ContratoService } from "app/@service/contrato.service";
import { ContratoDetalleService } from "app/@service/contratodetalle.service";
import { Archivo } from "app/model/archivo";
import { GrupoEmpresarial } from 'app/model/administracion/grupoempresarial';

declare var DatatableFunctions;
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'organizacionadminebizdetalle-cmp',
  templateUrl: './organizacionadminebizdetalle.component.html',
  providers: [MasterService, 
    OrganizacionService, 
    GrupoEmpresarialService, 
    ShowNotify, 
    AdjuntoService, 
    AdmMasterService, 
    ModuloService, 
    UiContratoDetalleService, 
    ContratoService,
    ContratoDetalleService]
})

export class OrganizacionAdminEbizDetalleComponent implements OnInit {
  public id: string = "";
  util: AppUtils;
  public organizacion:Organizacion;
  contratoComprador:Contrato;
  contratoProveedor:Contrato;
  contratoFactor:Contrato;  
  uiContratoDetalle:UiContratoDetalle;
  modulosDisponibles:Modulo[] = [];
  modulosSeleccionadosComprador:Modulo [] = [];
  modulosSeleccionadosProveedor:Modulo [] = [];
  modulosSeleccionadosFactor:Modulo [] = [];
  tiposContratos:any = [{'IdTipoContrato' : 'De pago' , 'Nombre': 'De pago'}, {'IdTipoContrato' : 'Gratuito' , 'Nombre': 'Gratuito'}];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private _masterService: MasterService, 
    private organizacionService: OrganizacionService,
    private grupoEmpresarialService: GrupoEmpresarialService,   
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private adjuntoService: AdjuntoService,
    private admMasterService: AdmMasterService,
    private moduloService: ModuloService,
    private uiContratoDetalleService: UiContratoDetalleService,
    private contratoService: ContratoService,
    private contratoDetalleService: ContratoDetalleService
  ) {
    this.util = new AppUtils(this.router, this._masterService);
    this.organizacion = new Organizacion();
    this.contratoComprador = new Contrato();
    this.contratoProveedor = new Contrato();
    this.contratoFactor = new Contrato();
    this.uiContratoDetalle = new UiContratoDetalle();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id != "nuevo") {
      this.organizacionService.obtenerOrganizacionPorId(this.id).subscribe(
        res => {
          this.organizacion = res['data'];          
          this.contratoComprador.IdOrganizacion = this.organizacion.IdOrganizacion;
          this.contratoProveedor.IdOrganizacion = this.organizacion.IdOrganizacion;
          this.contratoFactor.IdOrganizacion = this.organizacion.IdOrganizacion;
          this.contratoComprador.TipoEmpresa = 'C';
          this.contratoProveedor.TipoEmpresa = 'P';
          this.contratoFactor.TipoEmpresa = 'F';
        }
      );      
      this.obtenerContratos(true);
    }



    let arrayParamsModulo = [
      {'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 9999999},
      {'param': 'cabecera', 'value': 'IdModulo,Descripcion,CodigoModulo,Mini,Habilitado,Orden,Estado'},
      {'param': 'filtro_nombre', 'value': 'Estado'},
      {'param': 'filtro_valor', 'value': 'ACTIV'},
      {'param': 'filtro_tipo', 'value': 'i'},
      {'param': 'ordenar', 'value': 'Orden'}];
    this.moduloService.obtenerListaModulo(arrayParamsModulo).subscribe(res=>{
      this.modulosDisponibles = res.data;
    });
    /* START MASTER */
    let arrayParamsMaster = [
      {'param': 'idorganizacion', 'value': 0},
      {'param': 'idtabla', 'value': 10005},
      {'param': 'portal', 'value': 'PEB2M'}
    ];
    this.admMasterService.obtenerLista(arrayParamsMaster).subscribe(res => {
      //console.log(res);
    });
    /* END MASTER */
    
    
  }

  obtenerContratos(updateContratoDetalle:boolean){
    let arrayParamsContrato = [
      {'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 10},
      {'param': 'cabecera', 'value': 'IdContrato,FechaInicio,FechaFin,IdOrganizacion,CantidadUsuarios,IdHorario,TipoEmpresa'},
      {'param': 'filtro_nombre', 'value': 'IdOrganizacion'},
      {'param': 'filtro_valor', 'value': this.id},
      {'param': 'filtro_tipo', 'value': 'i'}];
      
      this.contratoService.obtenerListaContrato(arrayParamsContrato).subscribe(
        res => {
          let resContrato:Contrato[] = res['data'];
          resContrato.forEach(contrato => {
            if (contrato.TipoEmpresa == 'C') {
              this.contratoComprador = contrato;
              this.contratoComprador.FechaInicio = this.formatoFechaUi(this.contratoComprador.FechaInicio);
              this.contratoComprador.FechaFin = this.formatoFechaUi(this.contratoComprador.FechaFin);
            }else if(contrato.TipoEmpresa == 'P'){
              this.contratoProveedor = contrato;
              this.contratoProveedor.FechaInicio = this.formatoFechaUi(this.contratoProveedor.FechaInicio);
              this.contratoProveedor.FechaFin = this.formatoFechaUi(this.contratoProveedor.FechaFin);
            }else if(contrato.TipoEmpresa == 'F'){
              this.contratoFactor = contrato; 
              this.contratoFactor.FechaInicio = this.formatoFechaUi(this.contratoFactor.FechaInicio);
              this.contratoFactor.FechaFin = this.formatoFechaUi(this.contratoFactor.FechaFin);
            }
            if (updateContratoDetalle) {
              this.obtenerContratosDetalles(contrato.IdContrato, contrato.TipoEmpresa);
            }
          });
        }
      );
  }

  obtenerContratosDetalles(idContrato:string, tipoEmpresa:string){
    this.modulosSeleccionadosComprador = [];
    this.modulosSeleccionadosProveedor = [];
    this.modulosSeleccionadosFactor = [];
    let arrayParamsContratoDetalle = [
      {'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 9999},
      {'param': 'cabecera', 'value': 'IdContratoDetalle,IdContrato,IdModulo,Numero,FechaInicio,FechaFin,Color,LogoUrl,ApiKey1,ApiKey2,MonedaImplementacion,CostoImplementacion,Habilitado'},
      {'param': 'filtro_nombre', 'value': 'IdContrato'},
      {'param': 'filtro_valor', 'value': idContrato},
      {'param': 'filtro_tipo', 'value': 'i'}];
      
      this.contratoDetalleService.obtenerListaContratoDetalle(arrayParamsContratoDetalle).subscribe(
        res => {
          let resContratoDetalle:ContratoDetalle[] = res['data'];
          resContratoDetalle.forEach(contratoDetalle => {            
            this.modulosDisponibles.forEach(modulo => {
              if (contratoDetalle.IdModulo == modulo.IdModulo && tipoEmpresa == 'C') {
                this.selecionarComprador(modulo);
              }else if (contratoDetalle.IdModulo == modulo.IdModulo && tipoEmpresa == 'P') {
                this.selecionarProveedor(modulo);
              }else if (contratoDetalle.IdModulo == modulo.IdModulo && tipoEmpresa == 'F') {
                this.selecionarFactor(modulo);
              }
            });
          });
        }
      );
  }

  formatoFechaUi(date:string):string {
    if (date != null) {
      return date.substr(8,2) +"/"+ date.substr(5,2) +"/"+ date.substr(0,4);
    }
    return null;
  }

  ngAfterViewChecked(){
    $("input").each(function () {
      if ($(this).val() != ''){
        $(this.parentElement).removeClass("is-empty");
      }else{
        $(this.parentElement).addClass("is-empty");
      }
    });
    
    $("select").each(function () {
      if ($(this).val() != ''){
        $(this.parentElement).removeClass("is-empty");
      }else{
        $(this.parentElement).addClass("is-empty");
      }
    });
  }

  guardarOrganizacion(e){
    this.inhabilitarForm();
    this.spinnerService.set(true);
        
  }

  verificarTipoEmpresa(tipoEmpresa){
    let arrayTipoEmpresa = this.organizacion.TipoEmpresa.split(',');
    if (arrayTipoEmpresa.indexOf(tipoEmpresa) !== -1) {
      return true
    }
    return false;
  }

  seleccionComprador(modulo:Modulo):boolean{
    let posicion = this.modulosSeleccionadosComprador.indexOf(modulo);
    if (posicion !== -1) {
      return true;
    }
    return false;
  }

  seleccionProveedor(modulo:Modulo):boolean{
    let posicion = this.modulosSeleccionadosProveedor.indexOf(modulo);
    if (posicion !== -1) {
      return true;
    }
    return false;
  }

  seleccionFactor(modulo:Modulo):boolean{
    let posicion = this.modulosSeleccionadosFactor.indexOf(modulo);
    if (posicion !== -1) {
      return true;
    }
    return false;
  }
  selecionarProveedor(modulo:Modulo){
    let posicion = this.modulosSeleccionadosProveedor.indexOf(modulo);
    if (posicion === -1) {
      this.modulosSeleccionadosProveedor.push(modulo);
    }else{      
      this.modulosSeleccionadosProveedor.splice(posicion, 1);
    }
  }
  selecionarFactor(modulo:Modulo){
    let posicion = this.modulosSeleccionadosFactor.indexOf(modulo);
    if (posicion === -1) {
      this.modulosSeleccionadosFactor.push(modulo);
    }else{      
      this.modulosSeleccionadosFactor.splice(posicion, 1);
    }
  }

  selecionarComprador(modulo:Modulo){
    let posicion = this.modulosSeleccionadosComprador.indexOf(modulo);
    if (posicion === -1) {
      this.modulosSeleccionadosComprador.push(modulo);
    }else{      
      this.modulosSeleccionadosComprador.splice(posicion, 1);
    }
  }

  inhabilitarForm(){    
    $('#formulario').find('input, textarea, button, select, a').attr('disabled','disabled');
  }

  habilitarForm(){    
    $('#formulario').find('input, textarea, button, select, a').removeAttr('disabled');
  }

  guardarContratoComprador(){
    this.inhabilitarForm();
    this.spinnerService.set(true);
    if(this.contratoComprador.FechaInicio.length < 5){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese fecha de inicio - Comprador.");
      this.habilitarForm();
      return false;
    }
    /// Fecha ///
    this.contratoComprador.FechaInicio = DatatableFunctions.ConvertStringToDatetime(this.contratoComprador.FechaInicio);
    if(this.contratoComprador.FechaFin.length > 5){
      this.contratoComprador.FechaFin = DatatableFunctions.ConvertStringToDatetime(this.contratoComprador.FechaFin);
    }else{
      this.contratoComprador.FechaFin = "";
    }
    /// Fin Fecha ///
    if (this.contratoComprador.IdContrato == "") {
      this.contratoComprador.TipoEmpresa = 'C';
      this.contratoService.crearContrato(this.contratoComprador).subscribe(
        response  => {
          this.handleMessage(response);
          this.habilitarForm();
        },
        error =>  console.log(<any>error));
    }else{
      this.contratoService.editarContrato(this.contratoComprador).subscribe(
        response  => {
          this.handleMessage(response);
        },
        error =>  console.log(<any>error));
    }
  }
  guardarContratoProveedor(){
    this.inhabilitarForm();
    this.spinnerService.set(true);
    if(this.contratoProveedor.FechaInicio.length < 5){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese fecha de inicio - Proveedor.");
      this.habilitarForm();
      return false;
    }
    /// Fecha ///
      this.contratoProveedor.FechaInicio = DatatableFunctions.ConvertStringToDatetime(this.contratoProveedor.FechaInicio);
      if(this.contratoProveedor.FechaFin.length > 5){
        this.contratoProveedor.FechaFin = DatatableFunctions.ConvertStringToDatetime(this.contratoProveedor.FechaFin);
      }else{
        this.contratoProveedor.FechaFin = "";
      }
      /// Fin Fecha ///
    if (this.contratoProveedor.IdContrato == "") {
      this.contratoProveedor.TipoEmpresa = 'P';
      this.contratoService.crearContrato(this.contratoProveedor).subscribe(
        response  => {
          this.handleMessage(response);
          this.habilitarForm();
        },
        error =>  console.log(<any>error));
    }
  }
  guardarContratoFactor(){
    this.inhabilitarForm();
    this.spinnerService.set(true);
    if(this.contratoFactor.FechaInicio.length < 5){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese fecha de inicio - Factor.");
      this.habilitarForm();
      return false;
    }
    /// Fecha ///
    this.contratoFactor.FechaInicio = DatatableFunctions.ConvertStringToDatetime(this.contratoFactor.FechaInicio);
    if(this.contratoFactor.FechaFin.length > 5){
      this.contratoFactor.FechaFin = DatatableFunctions.ConvertStringToDatetime(this.contratoFactor.FechaFin);
    }else{
      this.contratoFactor.FechaFin = "";
    }
    /// Fin Fecha ///
    if (this.contratoFactor.IdContrato == "") {
      this.contratoFactor.TipoEmpresa = 'F';
      this.contratoService.crearContrato(this.contratoFactor).subscribe(
        response  => {
          this.handleMessage(response);
          this.habilitarForm();
        },
        error =>  console.log(<any>error));
    }
  }

  guardarContratoDetalleComprador(){
    this.uiContratoDetalle = new UiContratoDetalle();
    this.spinnerService.set(true);
    let arrayContratoDetalle:ContratoDetalle[] = [];
    this.modulosSeleccionadosComprador.forEach(element => {
      let contratoDetalle:ContratoDetalle = new ContratoDetalle();
      contratoDetalle.IdModulo = element.IdModulo;
      contratoDetalle.IdContrato = this.contratoComprador.IdContrato;
      contratoDetalle.FechaInicio = this.contratoComprador.FechaInicio;
      contratoDetalle.FechaFin = this.contratoComprador.FechaFin;
      /// Fecha ///
      contratoDetalle.FechaInicio = DatatableFunctions.ConvertStringToDatetime(this.contratoComprador.FechaInicio);
      if(this.contratoComprador.FechaFin.length > 5){
        contratoDetalle.FechaFin = DatatableFunctions.ConvertStringToDatetime(this.contratoComprador.FechaFin);
      }else{
        contratoDetalle.FechaFin = "";
      }
      /// Fin Fecha ///
      arrayContratoDetalle.push(contratoDetalle);
      
    });

    this.uiContratoDetalle.IdContrato = this.contratoComprador.IdContrato;
    this.uiContratoDetalle.ListaContratoDetalle = arrayContratoDetalle;
    this.uiContratoDetalleService.editarUiModuloUrlBoton(this.uiContratoDetalle).subscribe(
      response  => {
        this.handleMessage(response);
      },
      error =>  console.log(<any>error));
  }

  guardarContratoDetalleProveedor(){
    this.uiContratoDetalle = new UiContratoDetalle();
    this.spinnerService.set(true);
    let arrayContratoDetalle:ContratoDetalle[] = [];
    this.modulosSeleccionadosProveedor.forEach(element => {
      let contratoDetalle:ContratoDetalle = new ContratoDetalle();
      contratoDetalle.IdModulo = element.IdModulo;
      contratoDetalle.IdContrato = this.contratoProveedor.IdContrato;
      contratoDetalle.FechaInicio = this.contratoProveedor.FechaInicio;
      contratoDetalle.FechaFin = this.contratoProveedor.FechaFin;
      /// Fecha ///
      contratoDetalle.FechaInicio = DatatableFunctions.ConvertStringToDatetime(this.contratoProveedor.FechaInicio);
      if(this.contratoProveedor.FechaFin.length > 5){
        contratoDetalle.FechaFin = DatatableFunctions.ConvertStringToDatetime(this.contratoProveedor.FechaFin);
      }else{
        contratoDetalle.FechaFin = "";
      }
      /// Fin Fecha ///
      arrayContratoDetalle.push(contratoDetalle);
      
    });

    this.uiContratoDetalle.IdContrato = this.contratoProveedor.IdContrato;
    this.uiContratoDetalle.ListaContratoDetalle = arrayContratoDetalle;
    this.uiContratoDetalleService.editarUiModuloUrlBoton(this.uiContratoDetalle).subscribe(
      response  => {
        this.handleMessage(response);
      },
      error =>  console.log(<any>error));
  }

  guardarContratoDetalleFactor(){
    this.uiContratoDetalle = new UiContratoDetalle();
    this.spinnerService.set(true);
    let arrayContratoDetalle:ContratoDetalle[] = [];
    this.modulosSeleccionadosFactor.forEach(element => {
      let contratoDetalle:ContratoDetalle = new ContratoDetalle();
      contratoDetalle.IdModulo = element.IdModulo;
      contratoDetalle.IdContrato = this.contratoFactor.IdContrato;
      contratoDetalle.FechaInicio = this.contratoFactor.FechaInicio;
      contratoDetalle.FechaFin = this.contratoFactor.FechaFin;
      /// Fecha ///
      contratoDetalle.FechaInicio = DatatableFunctions.ConvertStringToDatetime(this.contratoFactor.FechaInicio);
      if(this.contratoProveedor.FechaFin.length > 5){
        contratoDetalle.FechaFin = DatatableFunctions.ConvertStringToDatetime(this.contratoFactor.FechaFin);
      }else{
        contratoDetalle.FechaFin = "";
      }
      /// Fin Fecha ///
      arrayContratoDetalle.push(contratoDetalle);
      
    });

    this.uiContratoDetalle.IdContrato = this.contratoFactor.IdContrato;
    this.uiContratoDetalle.ListaContratoDetalle = arrayContratoDetalle;
    this.uiContratoDetalleService.editarUiModuloUrlBoton(this.uiContratoDetalle).subscribe(
      response  => {
        this.handleMessage(response);
      },
      error =>  console.log(<any>error));
  }

  handleMessage(response)
  {
    this.spinnerService.set(false);
    if (response.status == 202) {
      $('#modal-contratodetalle-comprador').modal('hide');
      $('#modal-contratodetalle-proveedor').modal('hide');
      $('#modal-contratodetalle-factor').modal('hide');
      setTimeout(()=>{
        this.obtenerContratos(false);
      },1500);
      
    }else{
      this.showNotify.notify('success', "No se pudo actualizar Organización.");
    }
	}
}
