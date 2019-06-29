import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "app/utils/app.utils";
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from 'app/@components/notify.component';
//Service
import { MasterService } from 'app/service/masterservice';
import { GrupoEmpresarialService } from 'app/@service/grupoempresarial.service';
import { OrganizacionService } from 'app/@service/organizacion.service';
import { ContratoService } from "app/@service/contrato.service";
import { ContratoDetalleService } from "app/@service/contratodetalle.service";
import { ModuloService } from "app/@service/modulo.service";
import { TipoContratoService } from "app/@service/tipocontrato.service.";
import { UiContratoDetalleService } from "app/@service/uicontratodetalle.service";
//Model
import { Organizacion } from "app/@model/administracion/Organizacion";
import { Contrato } from "app/@model/administracion/Contrato";
import { Modulo } from "app/@model/administracion/Modulo";
import { ContratoDetalle } from "app/@model/administracion/ContratoDetalle";
import { UiContratoDetalle } from "app/@model/administracion/ui/UiContratoDetalle";
import { TipoContrato } from "app/@model/administracion/TipoContrato";

import 'app/../assets/js/plugins/jquery.PrintArea.js';

declare var DatatableFunctions;
declare var $: any;
var oContratosAdminEbizFormularioComponent;
@Component({
  moduleId: module.id,
  selector: 'contratosadminebizformulario-cmp',
  templateUrl: './contratosadminebizformulario.component.html',
  providers: [
    ShowNotify,
    MasterService,
    GrupoEmpresarialService,
    OrganizacionService,
    ContratoService,
    ContratoDetalleService,
    ModuloService,
    TipoContratoService,
    UiContratoDetalleService
  ]
})

export class ContratosAdminEbizFormularioComponent implements OnInit {
  title:String = 'Crear contrato';
  id:string;
  editarContratoComprador:boolean = false;
  editarContratoProveedor:boolean = false;
  editarContratoFactor:boolean = false;
  mostrarFormluarioContrato:boolean = false;
  organizaciones:any = [];
  util: AppUtils;
  arraySearchParams:any = [];
  organizacion: Organizacion;
  contratoComprador:Contrato;
  contratoProveedor:Contrato;
  contratoFactor:Contrato;  
  uiContratoDetalle:UiContratoDetalle;
  modulosDisponibles:Modulo[] = [];
  modulosSeleccionadosComprador:Modulo [] = [];
  modulosSeleccionadosProveedor:Modulo [] = [];
  modulosSeleccionadosFactor:Modulo [] = [];
  tiposContratos:any = [];
  gruposEmpresariales:any = [];
  tabSelecionado:string;
  mostrarMensajeTipoEmpresa:boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private masterService: MasterService, 
    private organizacionService: OrganizacionService,
    private grupoEmpresarialService: GrupoEmpresarialService,
    private contratoService: ContratoService,
    private contratoDetalleService: ContratoDetalleService,
    private moduloService: ModuloService,
    private tipoContratoService: TipoContratoService,
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private uiContratoDetalleService: UiContratoDetalleService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.organizacion = new Organizacion();
    this.contratoComprador = new Contrato();
    this.contratoProveedor = new Contrato();
    this.contratoFactor = new Contrato();
    this.uiContratoDetalle = new UiContratoDetalle();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id != 'nuevo') {
        this.title = 'Editar contrato';
      }
    });
    
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

    let arrayParamsTipoContrato = [
      {'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 10},
      {'param': 'cabecera', 'value': 'IdTipoContrato,IdHorario,CodigoTipo,Descripcion,Habilitado'},
      {'param': 'filtro_nombre', 'value': 'Habilitado'},
      {'param': 'filtro_valor', 'value': 1},
      {'param': 'filtro_tipo', 'value': 'i'}];

    this.tipoContratoService.obtenerListaTipoContrato(arrayParamsTipoContrato).subscribe(res=>{
      this.tiposContratos = res.data;
    });

    let arrayParamsGrupoEmpresarial:any = [{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 9999999},
    {'param': 'cabecera', 'value': 'IdGrupo,Descripcion'},
    {'param': 'filtro_nombre', 'value': 'Estado'},
    {'param': 'filtro_valor', 'value': 'ACTIV'},
    {'param': 'filtro_tipo', 'value': 'i'},
    {'param': 'orden', 'value': 'Descripcion,ASC'}];
    this.grupoEmpresarialService.obtenerListaGrupoEmpresarial(arrayParamsGrupoEmpresarial).subscribe(res => {
      this.gruposEmpresariales = res.data;
      if (this.id != 'nuevo') {
        this.obtenerOrganizacion(this.id);
      }
    })
  }

  ngAfterViewInit() {
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

  buscarOrganizacion(o: NgForm){ 
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (o.value.Ruc != '') {
      arrayFiltroNombre.push('Ruc');
      arrayFiltroValor.push(o.value.Ruc.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (o.value.Nombre != '') {
      arrayFiltroNombre.push('Nombre');
      arrayFiltroValor.push(o.value.Nombre.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (o.value.IdGrupo != '') {
      arrayFiltroNombre.push('IdGrupo');
      arrayFiltroValor.push(o.value.IdGrupo.replace(/,/g,""));
      arrayFiltroTipo.push('i');
    }
    if (o.value.Ruc == '' && o.value.Nombre == '' && o.value.IdGrupo == '') {
      this.showNotify.notify('danger', "Ingrese algún parametro de busqueda.");
      return false;
    }
    if (arrayFiltroNombre.length > 0) {
      this.arraySearchParams.push({'param': 'filtro_nombre', 'value': arrayFiltroNombre.join(',')});
      this.arraySearchParams.push({'param': 'filtro_valor', 'value': arrayFiltroValor.join(',')});
      this.arraySearchParams.push({'param': 'filtro_tipo', 'value': arrayFiltroTipo.join(',')});
      this.mostrarResultadosBusquedaOrganizacion();
    }else{
      this.mostrarResultadosBusquedaOrganizacion();
    }
  }
  reset(o: NgForm){
    o.resetForm({
      Ruc: '',
      Nombre: '',
      IdGrupo: ''
   });
  };
  mostrarResultadosBusquedaOrganizacion(){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': 0});
    arrayParams.push({'param': 'mostrar', 'value': 10});
    arrayParams.push({'param': 'cabecera', 'value': 'IdOrganizacion,Ruc,Nombre,GrupoEmpresarial'});
    arrayParams = arrayParams.concat(this.arraySearchParams);
    this.organizacionService.obtenerListaOrganizacion(arrayParams).subscribe(
      res => {
        this.organizaciones = res.data;
      }
    );
  }

  selecionOrganizacion(IdOrganizacion){
    this.obtenerOrganizacion(IdOrganizacion);
  }

  obtenerOrganizacion(IdOrganizacion){    
    this.organizacionService.obtenerOrganizacionPorId(IdOrganizacion).subscribe(
      res => {
        this.organizacion = res['data'];
        /*
        this.contratoComprador = new Contrato();
        this.contratoProveedor = new Contrato();
        this.contratoFactor = new Contrato();
        this.uiContratoDetalle = new UiContratoDetalle();
        this.modulosSeleccionadosComprador = [];
        this.modulosSeleccionadosProveedor = [];
        this.modulosSeleccionadosFactor = [];
        this.tabSelecionado = '';
        this.mostrarMensajeTipoEmpresa = false;
        */

        let arrayTipoEmpresa = this.organizacion.TipoEmpresa.split(',');
        if (arrayTipoEmpresa.length>0) {
          this.tabSelecionado = arrayTipoEmpresa[0];
        }
        
        $('#ruc').removeClass('is-empty');
        $('#buscar-organizacion').modal('hide');     
        this.contratoComprador.IdOrganizacion = this.organizacion.IdOrganizacion;
        this.contratoProveedor.IdOrganizacion = this.organizacion.IdOrganizacion;
        this.contratoFactor.IdOrganizacion = this.organizacion.IdOrganizacion;
        this.contratoComprador.TipoEmpresa = 'C';
        this.contratoProveedor.TipoEmpresa = 'P';
        this.contratoFactor.TipoEmpresa = 'F';
        this.obtenerContratos(IdOrganizacion, true);
        this.mostrarFormluarioContrato = true;

        if (this.organizacion.TipoEmpresa == '') {
          this.mostrarMensajeTipoEmpresa = true;
        }
        setTimeout(()=>{          
          this.ngAfterViewInit();
        },500);   
      }
    ); 
  }

  obtenerContratos(IdOrganizacion, updateContratoDetalle:boolean){    
    this.modulosSeleccionadosComprador = [];
    this.modulosSeleccionadosProveedor = [];
    this.modulosSeleccionadosFactor = [];
    let arrayParamsContrato = [
      {'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 10},
      {'param': 'cabecera', 'value': 'IdContrato,FechaInicio,Numero,FechaFin,IdOrganizacion,CantidadUsuarios,IdHorario,TipoEmpresa,IdTipoContrato'},
      {'param': 'filtro_nombre', 'value': 'IdOrganizacion'},
      {'param': 'filtro_valor', 'value': IdOrganizacion},
      {'param': 'filtro_tipo', 'value': 'i'}];
      
      this.contratoService.obtenerListaContrato(arrayParamsContrato).subscribe(
        res => {
          let resContrato:Contrato[] = res['data'];
          resContrato.forEach(contrato => {
            if (contrato.TipoEmpresa == 'C') {
              this.contratoComprador = contrato;
              this.contratoComprador.FechaInicio = this.formatoFechaUi(this.contratoComprador.FechaInicio);
              this.contratoComprador.FechaFin = this.formatoFechaUi(this.contratoComprador.FechaFin);
              this.tabSelecionado = 'C';              
            }else if(contrato.TipoEmpresa == 'P'){
              this.contratoProveedor = contrato;
              this.contratoProveedor.FechaInicio = this.formatoFechaUi(this.contratoProveedor.FechaInicio);
              this.contratoProveedor.FechaFin = this.formatoFechaUi(this.contratoProveedor.FechaFin);
              this.tabSelecionado = 'P';
            }else if(contrato.TipoEmpresa == 'F'){
              this.contratoFactor = contrato; 
              this.contratoFactor.FechaInicio = this.formatoFechaUi(this.contratoFactor.FechaInicio);
              this.contratoFactor.FechaFin = this.formatoFechaUi(this.contratoFactor.FechaFin);
              this.tabSelecionado = 'F';
            }
            if (updateContratoDetalle) {
              this.obtenerContratosDetalles(contrato.IdContrato, contrato.TipoEmpresa);
            }
          });

          if (this.contratoComprador.IdContrato == '') {
            this.activarEditarContratoComprador();
          }
          if (this.contratoProveedor.IdContrato == '') {
            this.activarEditarContratoProveedor();
          }
          if (this.contratoFactor.IdContrato == '') {
            this.activarEditarContratoFactor();
          }
          setTimeout(()=>{          
            this.ngAfterViewInit();
          },500);   
        }
      );
  }

  obtenerContratosDetalles(idContrato:string, tipoEmpresa:string){
    let arrayParamsContratoDetalle = [
      {'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 9999},
      {'param': 'cabecera', 'value': 'IdContratoDetalle,IdContrato,IdModulo,FechaInicio,FechaFin,Color,LogoUrl,ApiKey1,ApiKey2,MonedaImplementacion,CostoImplementacion,Habilitado'},
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
          this.ngAfterViewInit();
        }
      );
  }

  verificarTipoEmpresa(tipoEmpresa){
    let arrayTipoEmpresa = this.organizacion.TipoEmpresa.split(',');
    if (arrayTipoEmpresa.indexOf(tipoEmpresa) !== -1) {
      return true
    }
    return false;
  }

  formatoFechaUi(date:string):string {
    if (date != null) {
      return date.substr(8,2) +"/"+ date.substr(5,2) +"/"+ date.substr(0,4);
    }
    return null;
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

  /**
   * Activar y desactivar edicion de contratos
   */
  activarEditarContratoComprador(){this.editarContratoComprador = true;}
  desactivarEditarContratoComprador(){this.editarContratoComprador = false;}
  activarEditarContratoProveedor(){this.editarContratoProveedor = true;}
  desactivarEditarContratoProveedor(){this.editarContratoProveedor = false;}
  activarEditarContratoFactor(){this.editarContratoFactor = true;}
  desactivarEditarContratoFactor(){this.editarContratoFactor = false;}

  /////COMPRADOR
  guardarContratoComprador(){
    this.inhabilitarForm();
    this.spinnerService.set(true);
    if(this.contratoComprador.FechaInicio == ''){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese fecha de inicio - Comprador.");
      this.habilitarForm();
      return false;
    }
    if(this.contratoComprador.IdTipoContrato == null || this.contratoComprador.IdTipoContrato == ''){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese el tipo de contrato.");
      this.habilitarForm();
      return false;
    }
    /// Fecha ///
    let inicio = this.contratoComprador.FechaInicio;
    let fin = this.contratoComprador.FechaFin;
    console.log(DatatableFunctions.ConvertStringToDatetime(this.contratoComprador.FechaInicio));
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
          setTimeout(()=>{
            this.obtenerContratos(this.contratoComprador.IdOrganizacion, false);
          },2000);
          this.habilitarForm();
          this.desactivarEditarContratoComprador();
        },
        error =>  console.log(<any>error));
    }else{
      this.contratoService.editarContrato(this.contratoComprador).subscribe(
        response  => {
          this.handleMessage(response);          
          this.habilitarForm();
          this.desactivarEditarContratoComprador();
        },
        error =>  console.log(<any>error));
    }
    this.contratoComprador.FechaInicio = inicio;
    this.contratoComprador.FechaFin = fin;

  }
  /////PROVEEDOR
  guardarContratoProveedor(){
    this.inhabilitarForm();
    this.spinnerService.set(true);
    if(this.contratoProveedor.FechaInicio == ''){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese fecha de inicio - Proveedor.");
      this.habilitarForm();
      return false;
    }
    if(this.contratoProveedor.IdTipoContrato == null || this.contratoProveedor.IdTipoContrato == ''){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese el tipo de contrato.");
      this.habilitarForm();
      return false;
    }
    /// Fecha ///
    let inicio = this.contratoProveedor.FechaInicio;
    let fin = this.contratoProveedor.FechaFin;
    this.contratoProveedor.FechaInicio = DatatableFunctions.ConvertStringToDatetime(this.contratoProveedor.FechaInicio);
    if(this.contratoProveedor.FechaFin.length > 5){
      this.contratoProveedor.FechaFin = DatatableFunctions.ConvertStringToDatetime(this.contratoProveedor.FechaFin);
    }else{
      this.contratoProveedor.FechaFin = "";
    }
    /// Fin Fecha ///

    if (this.contratoProveedor.IdContrato == "" || this.contratoProveedor.IdTipoContrato == '') {
      this.contratoProveedor.TipoEmpresa = 'P';
      this.contratoService.crearContrato(this.contratoProveedor).subscribe(
        response  => {
          this.handleMessage(response);          
          setTimeout(()=>{
            this.obtenerContratos(this.contratoProveedor.IdOrganizacion, false);
          },2000);
          this.habilitarForm();
          this.desactivarEditarContratoProveedor();
        },
        error =>  console.log(<any>error));
    }else{
      this.contratoService.editarContrato(this.contratoProveedor).subscribe(
        response  => {
          this.handleMessage(response);          
          this.habilitarForm();
          this.desactivarEditarContratoProveedor();
        },
        error =>  console.log(<any>error));
    }
    this.contratoProveedor.FechaInicio = inicio;
    this.contratoProveedor.FechaFin = fin;

  }
  /////FACTOR
  guardarContratoFactor(){
    this.inhabilitarForm();
    this.spinnerService.set(true);
    if(this.contratoFactor.FechaInicio == ''){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese fecha de inicio - Factor.");
      this.habilitarForm();
      return false;
    }
    if(this.contratoFactor.IdTipoContrato == null || this.contratoFactor.IdTipoContrato == ''){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese el tipo de contrato.");
      this.habilitarForm();
      return false;
    }
    /// Fecha ///
    let inicio = this.contratoFactor.FechaInicio;
    let fin = this.contratoFactor.FechaFin;
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
          setTimeout(()=>{
            this.obtenerContratos(this.contratoFactor.IdOrganizacion, false);
          },2000);
          this.habilitarForm();
          this.desactivarEditarContratoFactor();
        },
        error =>  console.log(<any>error));
    }else{
      this.contratoService.editarContrato(this.contratoFactor).subscribe(
        response  => {
          this.handleMessage(response);          
          this.habilitarForm();
          this.desactivarEditarContratoFactor();
        },
        error =>  console.log(<any>error));
    }
    this.contratoFactor.FechaInicio = inicio;
    this.contratoFactor.FechaFin = fin;

  }

  guardarContratoDetalleComprador(){
    this.uiContratoDetalle = new UiContratoDetalle();
    this.spinnerService.set(true);
    let arrayContratoDetalle:ContratoDetalle[] = [];
    this.modulosSeleccionadosComprador.forEach(element => {
      let contratoDetalle:ContratoDetalle = new ContratoDetalle();
      contratoDetalle.IdModulo = element.IdModulo;
      contratoDetalle.IdContrato = this.contratoComprador.IdContrato;
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
        //this.obtenerContratos(false);
      },1500);
      
    }else{
      this.showNotify.notify('success', "No se pudo actualizar Organización.");
    }
	}
}
