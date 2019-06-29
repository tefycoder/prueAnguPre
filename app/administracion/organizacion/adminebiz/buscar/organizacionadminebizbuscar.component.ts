import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { NgForm } from '@angular/forms';
//Model
import { Organizacion } from 'app/@model/administracion/Organizacion';
//Service
import { GrupoEmpresarialService } from 'app/@service/grupoempresarial.service';
import { OrganizacionService } from 'app/@service/organizacion.service';
import { EstadoService } from "app/@service/estado.service";
import { HabilitadoService } from "app/@service/habilitado.service";
//Shape
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from '../../../../@components/notify.component';
//Constantes
import { MOSTRAR_RESULTADOS, PAGINA_INICIAL, MOSTRAR } from "app/utils/app.constants";

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'organizacionadminebizbuscar-cmp',
  templateUrl: './organizacionadminebizbuscar.component.html',
  providers: [
    MasterService, 
    GrupoEmpresarialService, 
    OrganizacionService, 
    EstadoService, 
    HabilitadoService,
    ShowNotify
  ]
})

export class OrganizacionAdminEbizBuscarComponent implements OnInit {
  util: AppUtils;
  gruposEmpresariales:any = [];
  arrayCambioEstadoIds:any = [];
  objEstado:any = {};
  loading = false;
  filtro_nombre:string;
  filtro_valor:string;
  filtro_tipo:string;
  ordenar:string;
  ordenarCount:number = 0;

  arrayParamsCodigoGrupoEmpresarial:any = [{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 9999999},
    {'param': 'cabecera', 'value': 'IdGrupo,Descripcion'},
    {'param': 'filtro_nombre', 'value': 'Estado'},
    {'param': 'filtro_valor', 'value': 'ACTIV'},
    {'param': 'filtro_tipo', 'value': 'i'},
    {'param': 'orden', 'value': 'Descripcion,ASC'}];

  /* Datos de tabla */
  paginas:any = [];
  paginaSeleccionada:any = PAGINA_INICIAL;
	mostrarResultados:any = MOSTRAR_RESULTADOS;
  mostrar:number = MOSTRAR;
  registros:number;
  arraySearchParams:any = [];
  organizaciones:any= [];
  /* Inhabilitar */
  organizacionHabilitado:Organizacion;
  objHabilitado:any = {};
  arrayInhabilitarIds:any = [];

  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.route });
  }

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private masterService: MasterService,
    private organizacionService: OrganizacionService,
    private grupoEmpresarialService: GrupoEmpresarialService,
    private estadoService: EstadoService,
    private habilitadoService: HabilitadoService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.organizacionHabilitado = new Organizacion();
  }

  ngOnInit() {
    this.listarOrganizacion(this.paginaSeleccionada, this.mostrar);
    this.grupoEmpresarialService.obtenerListaGrupoEmpresarial(this.arrayParamsCodigoGrupoEmpresarial).subscribe(res => {
      this.gruposEmpresariales = res.data;
    })
  }

  ngAfterViewChecked(){    
    $("select").each(function () {
      if ($(this).val() != ''){
        $(this.parentElement).removeClass("is-empty");
      }else{
        $(this.parentElement).addClass("is-empty");
      }
    });
  }

  listarOrganizacion(pagina, mostrar){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': pagina});
    arrayParams.push({'param': 'mostrar', 'value': mostrar});
    arrayParams.push({'param': 'cabecera', 'value': 'IdOrganizacion,Ruc,Nombre,GrupoEmpresarial,Estado'});

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
    this.organizacionService.obtenerListaOrganizacion(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.organizaciones = res.data;
        this.getPaginas(res.rows);
      }
    );
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
    this.listarOrganizacion(seleccion, this.mostrar);
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
      this.showNotify.notify('warning', "Seleccione organizacion(es) a cambiar de estado.");
    } else {
      if (estado == 'ACTIV') {
        $('#confirmar-activar').modal('show');
      }else if (estado == 'INACT') {
        $('#confirmar-desactivar').modal('show');
      }
    }
  }

  cambiarEstadoSelecionados(estado){
    if (this.arrayCambioEstadoIds.length == 0) {
      console.log("No se a selecionado aun.");
    } else {      
       this.spinnerService.set(true);
       this.objEstado = {};
       this.objEstado.Modulo = 'organizacion';
       this.objEstado.Estado = estado;
       this.objEstado.Ids = this.arrayCambioEstadoIds;      
       this.organizaciones.forEach(organizacion => {
        this.objEstado.Ids.forEach(id => {
          if (organizacion.IdOrganizacion == id) {
            organizacion.Estado = estado;
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

  /* Buscar Organizacion */
  buscarOrganizacion(o: NgForm){ 
    this.loading = false;
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (o.value.Ruc != '') {
      if (!/^([0-9]{0,11})$/.test(o.value.Ruc)) {
        this.showNotify.notify('danger', "Ingrese RUC de organización válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('Ruc');
      arrayFiltroValor.push(o.value.Ruc.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (o.value.Nombre != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{0,50})$/.test(o.value.Nombre)) {
        this.showNotify.notify('danger', "Ingrese razón social de organización válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('Nombre');
      arrayFiltroValor.push(o.value.Nombre.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (o.value.IdGrupo != '') {
      arrayFiltroNombre.push('IdGrupo');
      arrayFiltroValor.push(o.value.IdGrupo.replace(/,/g,""));
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

  reset(o: NgForm){
    o.resetForm({
      Ruc: '',
      Nombre: '',
      IdGrupo: ''
   });
  };  
  

  
  /**
   * 
   * @param organizacion Inhabilitar
   */
  confimarInhabilitarOrganizacion(organizacion:Organizacion){
    this.organizacionHabilitado = organizacion;
    $('#confirmar-inhabilitar').modal('show');
    this.arrayInhabilitarIds = [];
    this.arrayInhabilitarIds.push(organizacion.IdOrganizacion);
  }

  inhabilitarOrganizacion(){
    this.spinnerService.set(true);
    this.objHabilitado = {};
    this.objHabilitado.Modulo = 'organizacion';
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
      $('#confirmar-activar').modal('hide');
      $('#confirmar-desactivar').modal('hide');
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
        this.listarOrganizacion(this.paginaSeleccionada, this.mostrar);
        this.spinnerService.set(false);
      },2000);
    }else{
      console.log(response);
    }
  }
}