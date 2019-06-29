import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { NgForm } from '@angular/forms';
//Model
import { TipoOrganizacion } from "app/@model/administracion/TipoOrganizacion";
//Service
import { TipoOrganizacionService } from "app/@service/TipoOrganizacion.service";
import { AprobadorService } from "app/@service/Aprobador.service";
import { GrupoEmpresarialService } from 'app/@service/grupoempresarial.service';
import { OrganizacionService } from 'app/@service/organizacion.service';
import { HabilitadoService } from "app/@service/habilitado.service";
import { EstadoService } from "app/@service/estado.service";
//Shape
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from '../../../../@components/notify.component';
//Constantes
import { MOSTRAR_RESULTADOS, PAGINA_INICIAL, MOSTRAR } from "app/utils/app.constants";
import { Aprobador } from '../../../../@model/administracion/Aprobador';
import { Organizacion } from '../../../../model/administracion/organizacion';
import { flatten } from '@angular/compiler';

declare var $;
@Component({
  moduleId: module.id,
  selector: 'aprobadoradminebizbuscar-cmp',
  templateUrl: './aprobadoradminebizbuscar.component.html',
  providers: [
    MasterService, 
    TipoOrganizacionService, 
    AprobadorService, 
    HabilitadoService,
    ShowNotify,
    GrupoEmpresarialService,
    OrganizacionService,
    EstadoService
  ]
})

export class AprobadorAdminEbizBuscarComponent implements OnInit {
  util: AppUtils; 
  //IdEditar
  idEditarAprobador:string;
  //Arrays
  aprobadores:any = [];
  aprobadoresRegistrados:any = [];
  tipoOrgnizaciones:any = [];
  organizaciones:any = [];
  gruposEmpresariales:any = [];
  organizacion:Organizacion;
  //**** Inicio parametros estado ****/
  arrayCambioEstadoIds:any = [];
  objEstado:any = {};
  //**** Fin parametros estado ****/
  //**** Inicio parametros datatable ****/
  loading = false;
  filtro_nombre:string;
  filtro_valor:string;
  filtro_tipo:string;
  ordenar:string;
  ordenarCount:number = 0;
  paginas:any = [];
  paginaSeleccionada:any = PAGINA_INICIAL;
	mostrarResultados:any = MOSTRAR_RESULTADOS;
  mostrar:number = MOSTRAR;
  registros:number;
  arraySearchParams:any = [];
  //**** Fin parametros datatable ****/
  //**** Inicio parametros habilitado ****/
  aprobadorHabilitado:Aprobador;
  objHabilitado:any = {};
  arrayInhabilitarIds:any = [];
  //**** Fin parametros habilitado ****/
  //Metodo de navegación
  navigate(nav) { this.router.navigate(nav, { relativeTo: this.route });}
  //**** Inicio constructor ****/
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private masterService: MasterService,
    private tipoOrganizacionService: TipoOrganizacionService,
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private aprobadorService: AprobadorService,
    private habilitadoService: HabilitadoService,
    private grupoEmpresarialService: GrupoEmpresarialService,
    private organizacionService: OrganizacionService,
    private estadoService: EstadoService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.aprobadorHabilitado = new Aprobador();
    this.organizacion = new Organizacion();
  }
  //**** Fin constructor ****/

  //**** Inicio metodos ng ****/
  ngOnInit() {
    this.listarAprobador(this.paginaSeleccionada, this.mostrar);
    this.listarTipoOrganizacion();
    this.listarGrupoEmpresarial();
  }
  //**** Fin metodos ng ****/

  listarAprobador(pagina, mostrar){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': pagina});
    arrayParams.push({'param': 'mostrar', 'value': mostrar});
    arrayParams.push({'param': 'cabecera', 'value': 'IdAprobador,IdOrganizacion,IdTipoOrganizacion,RazonSocial,Aprobador'});

    let orden:string = "";
    if (this.ordenarCount > 0) {
      if (this.ordenarCount == 1) {
        orden = this.ordenar + ",ASC"
      }else if (this.ordenarCount == 2) {
        orden = this.ordenar + ",DESC"
      }
      arrayParams.push({'param': 'orden', 'value': orden});
    }

    arrayParams = arrayParams.concat(this.arraySearchParams);
    this.aprobadorService.obtenerListaAprobador(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.aprobadores = res.data;
        this.getPaginas(res.rows);
      }
    );
  }

  listaAprobadorRegistrados(){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': 0});
    arrayParams.push({'param': 'mostrar', 'value': 999999999});
    arrayParams.push({'param': 'cabecera', 'value': 'IdOrganizacion'});

    let orden:string = "";
    if (this.ordenarCount > 0) {
      if (this.ordenarCount == 1) {
        orden = this.ordenar + ",ASC"
      }else if (this.ordenarCount == 2) {
        orden = this.ordenar + ",DESC"
      }
      arrayParams.push({'param': 'orden', 'value': orden});
    }

    arrayParams = arrayParams.concat(this.arraySearchParams);
    this.aprobadorService.obtenerListaAprobador(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.aprobadoresRegistrados = res.data;
      }
    );
  }

  listarTipoOrganizacion(){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': 0});
    arrayParams.push({'param': 'mostrar', 'value': 90});
    arrayParams.push({'param': 'cabecera', 'value': 'IdTipoOrganizacion,TipoOrganizacion,Descripcion,FlagCombo'});
    arrayParams.push({'param': 'filtro_nombre', 'value': 'FlagCombo'});
    arrayParams.push({'param': 'filtro_valor', 'value': '01'});
    arrayParams.push({'param': 'filtro_tipo', 'value': 'i'});
    
    let orden:string = "";
    if (this.ordenarCount > 0) {
      if (this.ordenarCount == 1) {
        orden = this.ordenar + ",ASC"
      }else if (this.ordenarCount == 2) {
        orden = this.ordenar + ",DESC"
      }
      arrayParams.push({'param': 'orden', 'value': orden});
    }

    arrayParams = arrayParams.concat(this.arraySearchParams);
    this.tipoOrganizacionService.obtenerListaTipoOrganizacion(arrayParams).subscribe(
      res => {
        this.tipoOrgnizaciones = res.data;
        this.listaAprobadorRegistrados();
      }
    );
  }

  listarGrupoEmpresarial(){
    let arrayParamsGrupoEmpresarial:any = [{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 9999999},
    {'param': 'cabecera', 'value': 'IdGrupo,Descripcion'},
    {'param': 'filtro_nombre', 'value': 'Estado'},
    {'param': 'filtro_valor', 'value': 'ACTIV'},
    {'param': 'filtro_tipo', 'value': 'i'},
    {'param': 'orden', 'value': 'Descripcion,ASC'}];
    this.grupoEmpresarialService.obtenerListaGrupoEmpresarial(arrayParamsGrupoEmpresarial).subscribe(res => {
      this.gruposEmpresariales = res.data;
    })
  }

  /**
   * Tabla
   */
  getPaginas(resultados){
    this.paginas = []
    let grupos = resultados / this.mostrar;
    for (let index = 0; index < grupos; index++) {
      this.paginas.push(index);    
    }
  }

  selecionarPagina(seleccion:number){
    this.loading = false;
    this.paginaSeleccionada = seleccion;
    this.listarAprobador(seleccion, this.mostrar);
  }

  cambiarResultadosMostrar(){
    this.loading = false;
    this.selecionarPagina(0);
  }
  
  ordenarResultados(cabecera){
    if (this.ordenar == cabecera) {
      this.ordenarCount++;
      if ( this.ordenarCount >= 3 ) {
        this.ordenarCount = 0;
        this.ordenar = "";
      }
    }else{
      this.ordenar = cabecera
      this.ordenarCount = 1;
    }
    this.cambiarResultadosMostrar();
  }
  
  /**
   * Checkboxes
   */
  seleccionarTodosRegistros(event){
    if (event) {
      $('input:checkbox').not(this).prop('checked', true);
    } else {
      $('input:checkbox').not(this).prop('checked', false);
    }
  }
  
  reset(a: NgForm){    
    a.resetForm({
      Ruc: '',
      RazonSocial: '',
      IdTipoOrganizacion: ''
   });
  };

  /* Buscar Grupo Empresarial */
  buscarAprobador(a: NgForm){    
    this.loading = false;
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (a.value.Ruc != '') {
      if (!/^([0-9]{0,11})$/.test(a.value.Ruc)) {
        this.showNotify.notify('danger', "Ingrese RUC de organización compradora válido.");
        this.loading = true;
        return false;
      }      
      arrayFiltroNombre.push('Ruc');
      arrayFiltroValor.push(a.value.Ruc.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (a.value.RazonSocial != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{0,50})$/.test(a.value.RazonSocial)) {
        this.showNotify.notify('danger', "Ingrese razón social válida.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('RazonSocial');
      arrayFiltroValor.push(a.value.RazonSocial.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (a.value.IdTipoOrganizacion != '') {
      arrayFiltroNombre.push('IdTipoOrganizacion');
      arrayFiltroValor.push(a.value.IdTipoOrganizacion.replace(/,/g,""));
      arrayFiltroTipo.push('i');
    }
    if (arrayFiltroNombre.length > 0) {   
      this.arraySearchParams.push({'param': 'filtro_nombre', 'value': arrayFiltroNombre.join(',')});
      this.arraySearchParams.push({'param': 'filtro_valor', 'value': arrayFiltroValor.join(',')});
      this.arraySearchParams.push({'param': 'filtro_tipo', 'value': arrayFiltroTipo.join(',')});
      this.cambiarResultadosMostrar();
    }else{
      this.cambiarResultadosMostrar();
    }
  }


  /**
   * Organizacion
   */
  buscarOrganizacion(o: NgForm){ 
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    arrayFiltroNombre.push('TipoEmpresa');
    arrayFiltroValor.push('C');
    arrayFiltroTipo.push('l');
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

  resetOrganizacion(o: NgForm){
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
    $('#buscar-organizacion').modal('hide');    
    this.spinnerService.set(true);
    console.log(this.aprobadoresRegistrados);
    this.aprobadoresRegistrados.forEach(organizacion => {
      if (IdOrganizacion == organizacion.IdOrganizacion) {
        this.showNotify.notify('warning', "Organización ya esta registrada en aprobadores.");   
        this.spinnerService.set(false);     
        return false;
      }
    });
    let aprobador = new Aprobador();
    aprobador.IdOrganizacion = IdOrganizacion;
    this.aprobadorService.crearAprobador(aprobador).subscribe(
      response  => {
        setTimeout(()=>{
          this.cambiarResultadosMostrar();
          this.spinnerService.set(false);     
        },2000);
      },
      error =>  console.log(<any>error));
  }

  editarAprobador(idAprobador:string){
    this.idEditarAprobador = idAprobador;
  }
  guardarAprobador(aprobador:Aprobador){
    let idTipoOrganizacionSeleccionado = $('#'+aprobador.IdAprobador).val();
    if (aprobador.IdTipoOrganizacion == idTipoOrganizacionSeleccionado) {
      this.showNotify.notify('warning', "No realizó algun cambio.");
    }else{
      let aprobadorEditado = new Aprobador();
      aprobadorEditado.IdAprobador = aprobador.IdAprobador;
      aprobadorEditado.IdOrganizacion = aprobador.IdOrganizacion;
      aprobadorEditado.IdTipoOrganizacion = idTipoOrganizacionSeleccionado
      this.tipoOrgnizaciones.forEach(tipoOrganizacion => {
        if (aprobadorEditado.IdTipoOrganizacion == tipoOrganizacion.IdTipoOrganizacion) {
          aprobadorEditado.Aprobador = tipoOrganizacion.TipoOrganizacion;
        }
      });
      this.aprobadores.forEach(aprobador => {
        if(aprobador.IdAprobador == aprobadorEditado.IdAprobador){
          aprobador.IdTipoOrganizacion = aprobadorEditado.IdTipoOrganizacion;
          aprobador.TipoOrganizacion = aprobadorEditado.Aprobador;
        }
      });      
      this.aprobadorService.editarAprobador(aprobadorEditado).subscribe(
        response  => {         
        },
        error =>  console.log(<any>error));
    }
    this.idEditarAprobador = '';
  }
  cancelarAprobador(){
    this.idEditarAprobador = '';
  }

  /**
   * Cambiar de estado
   */

  verificarSeleccionCambioEstadoIds(estado){
    this.arrayCambioEstadoIds = [];
    let checkbox_checkbox = $('tbody input:checkbox').find(':checked');
    checkbox_checkbox = checkbox_checkbox.prevObject;
    for (let index = 0; index < checkbox_checkbox.length; index++) {
      let element = checkbox_checkbox[index];
      if (element.checked) {
        this.arrayCambioEstadoIds.push(element.value);
      }
    }
    if (this.arrayCambioEstadoIds.length == 0) {
      this.showNotify.notify('warning', "Seleccione orgnaizaciones a cambiar de aprobador.");
    } else {
      if (estado == 'F') {
        $('#confirmar-factor').modal('show');
      }else if (estado == 'C') {
        $('#confirmar-comprador').modal('show');
      }
    }
  }

  cambiarEstadoSelecionados(estado){
    if (this.arrayCambioEstadoIds.length == 0) {
      console.log("No se a selecionado aun.");
    } else {      
       this.spinnerService.set(true);
       this.objEstado = {};
       this.objEstado.Modulo = 'aprobador';
       this.objEstado.Estado = estado;
       this.objEstado.Ids = this.arrayCambioEstadoIds;
       this.aprobadores.forEach(aprobador => {
        this.objEstado.Ids.forEach(id => {
          if (aprobador.IdAprobador == id) {
            aprobador.Aprobador = estado;
          }
        });
        this.tipoOrgnizaciones.forEach(tipoOrganizacion => {
          console.log(tipoOrganizacion.TipoOrganizacion);
          if (tipoOrganizacion.TipoOrganizacion == estado) {
            aprobador.IdTipoOrganizacion = tipoOrganizacion.IdTipoOrganizacion;
          }
        });
       });
       this.estadoService.cambiarEstado(this.objEstado).subscribe(
        response  => {
         this.handleMessage(response);
        },
        error =>  console.log(<any>error));
    }
  }

  
  /**
   * 
   * @param aprobador Inhabilitar
   */
  confimarInhabilitarAprobador(aprobador:Aprobador){
    this.aprobadorHabilitado = aprobador;
    $('#confirmar-inhabilitar').modal('show');
    this.arrayInhabilitarIds = [];
    this.arrayInhabilitarIds.push(aprobador.IdAprobador);
  }

  inhabilitarAprobador(){
    this.spinnerService.set(true);
    this.objHabilitado = {};
    this.objHabilitado.Modulo = 'aprobador';
    this.objHabilitado.Habilitado = 0;
    this.objHabilitado.Ids = this.arrayInhabilitarIds;       
    this.habilitadoService.cambiarHabilitado(this.objHabilitado).subscribe(
      response  => {
        this.handleMessageUpdate(response);        
      },
      error =>  console.log(<any>error));
  }

  handleMessage(response)
  {
    if (response.status == 202) {
      $('#confirmar-factor').modal('hide');
      $('#confirmar-comprador').modal('hide');
      $('#confirmar-inhabilitar').modal('hide');
      $('#seleccionar-todos').prop( "checked", false );
      $('input:checkbox').not(this).prop('checked', false);
      this.spinnerService.set(false);    
    }else{
      console.log(response);
    }
  }
  handleMessageUpdate(response)
  {
    if (response.status == 202) {
      $('#confirmar-inhabilitar').modal('hide');
      setTimeout(()=>{
        this.listarAprobador(this.paginaSeleccionada, this.mostrar);
        this.spinnerService.set(false);
      },2000);
    }else{
      console.log(response);
    }
  }

}
