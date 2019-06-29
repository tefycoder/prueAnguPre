import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { NgForm } from '@angular/forms';
//Model
import { GrupoEmpresarial } from "app/@model/administracion/GrupoEmpresarial";
//Service
import { GrupoEmpresarialService } from "app/@service/grupoempresarial.service";
import { EstadoService } from "app/@service/estado.service";
import { HabilitadoService } from "app/@service/habilitado.service";
//Shape
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from '../../../../@components/notify.component';
//Constantes
import { MOSTRAR_RESULTADOS, PAGINA_INICIAL, MOSTRAR } from "app/utils/app.constants";

declare var $;
@Component({
  moduleId: module.id,
  selector: 'grupoempresarialadminebizbuscar-cmp',
  templateUrl: './grupoempresarialadminebizbuscar.component.html',
  providers: [
    MasterService, 
    GrupoEmpresarialService, 
    EstadoService,
    HabilitadoService,
    ShowNotify
  ]
})

export class GrupoEmpresarialAdminEbizBuscarComponent implements OnInit {
  util: AppUtils; 
  //Array de grupos empresarial 
  gruposEmpresariales:any = [];
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
  grupoEmpresarialHabilitado:GrupoEmpresarial;
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
    private grupoEmpresarialService: GrupoEmpresarialService,
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private estadoService: EstadoService,
    private habilitadoService: HabilitadoService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.grupoEmpresarialHabilitado = new GrupoEmpresarial();
  }
  //**** Fin constructor ****/

  //**** Inicio metodos ng ****/
  ngOnInit() {
    this.listarGrupoEmpresarial(this.paginaSeleccionada, this.mostrar);
    $('[data-toggle="tooltip"]').tooltip();
  }
  //**** Fin metodos ng ****/

  listarGrupoEmpresarial(pagina, mostrar){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': pagina});
    arrayParams.push({'param': 'mostrar', 'value': mostrar});
    arrayParams.push({'param': 'cabecera', 'value': 'IdGrupo,Codigo,Descripcion,Estado'});

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
    this.grupoEmpresarialService.obtenerListaGrupoEmpresarial(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.gruposEmpresariales = res.data;
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
    this.listarGrupoEmpresarial(seleccion, this.mostrar);
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
      this.showNotify.notify('warning', "Seleccione grupo empresarial a cambiar de estado.");
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
       this.objEstado.Modulo = 'grupoempresarial';
       this.objEstado.Estado = estado;
       this.objEstado.Ids = this.arrayCambioEstadoIds;
       this.gruposEmpresariales.forEach(grupoEmpresarial => {
        this.objEstado.Ids.forEach(id => {
          if (grupoEmpresarial.IdGrupo == id) {
            grupoEmpresarial.Estado = estado;
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

  /* Buscar Grupo Empresarial */
  buscarGrupoEmpresarial(ge: NgForm){    
    this.loading = false;
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (ge.value.Codigo != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-.]{0,6})$/.test(ge.value.Codigo)) {
        this.showNotify.notify('danger', "Ingrese código de grupo empresarial válido.");
        this.loading = true;
        return false;
      }      
      arrayFiltroNombre.push('Codigo');
      arrayFiltroValor.push(ge.value.Codigo.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (ge.value.Descripcion != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{0,50})$/.test(ge.value.Descripcion)) {
        this.showNotify.notify('danger', "Ingrese grupo empresarial válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('Descripcion');
      arrayFiltroValor.push(ge.value.Descripcion.replace(/,/g,""));
      arrayFiltroTipo.push('l');
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

  reset(ge: NgForm){    
    ge.resetForm({
      Codigo: '',
      Descripcion: ''
   });
  };
  
  /**
   * 
   * @param grupoEmpresarial Inhabilitar
   */
  confimarInhabilitarGrupoEmpresarial(grupoEmpresarial:GrupoEmpresarial){
    this.grupoEmpresarialHabilitado = grupoEmpresarial;
    $('#confirmar-inhabilitar').modal('show');
    this.arrayInhabilitarIds = [];
    this.arrayInhabilitarIds.push(grupoEmpresarial.IdGrupo);
  }

  inhabilitarGrupoEmpresarial(){
    this.spinnerService.set(true);
    this.objHabilitado = {};
    this.objHabilitado.Modulo = 'grupoempresarial';
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
        this.listarGrupoEmpresarial(this.paginaSeleccionada, this.mostrar);
        this.spinnerService.set(false);
      },2000);
    }else{
      console.log(response);
    }
  }
}
  