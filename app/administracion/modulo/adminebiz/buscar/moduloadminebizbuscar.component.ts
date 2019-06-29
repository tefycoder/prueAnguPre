import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { NgForm } from '@angular/forms';
//Model
import { Modulo } from "app/@model/administracion/Modulo";
//Service
import { MasterService } from 'app/service/masterservice';
import { ModuloService } from "app/@service/modulo.service";
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
  selector: 'moduloadminebizbuscar-cmp',
  templateUrl: './moduloadminebizbuscar.component.html',
  providers: [
    MasterService, 
    ModuloService, 
    EstadoService,
    HabilitadoService,
    ShowNotify]
})

export class ModuloAdminEbizBuscarComponent implements OnInit {  
  util: AppUtils;
  /* Objeto Grupo Empresarial */
  modulos:any = [];
  arrayCambioEstadoIds:any = [];
  objEstado:any = {};
  loading = false;
  filtro_nombre:string;
  filtro_valor:string;
  filtro_tipo:string;
  ordenar:string;
  ordenarCount:number = 0;
  editarOrden:boolean = false;
  //modulo: any = {}
  /* Datos de tabla */
  paginas:any = [];
  paginaSeleccionada:any = PAGINA_INICIAL;
  mostrarResultados:any = MOSTRAR_RESULTADOS;
  mostrar:number = MOSTRAR;
  registros:number;
  arraySearchParams:any = [];
  /* Inhabilitar */
  moduloHabilitado:Modulo;
  objHabilitado:any = {};
  arrayInhabilitarIds:any = [];
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.route });
  }
  /* Constructor */
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private masterService: MasterService,
    private moduloService: ModuloService,
    private estadoService: EstadoService,
    private habilitadoService: HabilitadoService,
    private showNotify: ShowNotify,
    private spinnerService: SpinnerService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.moduloHabilitado = new Modulo();
  }

  ngOnInit() {
    this.listarModulo(this.paginaSeleccionada, this.mostrar);
  }

  listarModulo(pagina, mostrar){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': pagina});
    arrayParams.push({'param': 'mostrar', 'value': mostrar});
    arrayParams.push({'param': 'cabecera', 'value': 'IdModulo,Descripcion,CodigoModulo,Mini,Orden,Estado'});

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
    this.moduloService.obtenerListaModulo(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.modulos = res.data;
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
    this.listarModulo(seleccion, this.mostrar);
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
      this.showNotify.notify('warning', "Seleccione módulo a cambiar de estado.");
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
        this.objEstado.Modulo = 'modulo';
        this.objEstado.Estado = estado;
        this.objEstado.Ids = this.arrayCambioEstadoIds;      
        this.modulos.forEach(modulo => {
          this.objEstado.Ids.forEach(id => {
            if (modulo.IdModulo == id) {
              modulo.Estado = estado;
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
  buscarModulo(m: NgForm){    
    this.loading = false;
    this.arraySearchParams = [];    
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (m.value.CodigoModulo != '') {
      if (!/^([A-Za-z0-9-]{0,10})$/.test(m.value.CodigoModulo)) {
        this.showNotify.notify('danger', "Ingrese código de módulo válido.");
        this.loading = true;
        return false;
      }  
      arrayFiltroNombre.push('CodigoModulo');
      arrayFiltroValor.push(m.value.CodigoModulo.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (m.value.Mini != '') {
      if (!/^([A-Za-z0-9-]{0,3})$/.test(m.value.Mini)) {
        this.showNotify.notify('danger', "Ingrese siglas del módulo válido.");
        this.loading = true;
        return false;
      }
      arrayFiltroNombre.push('Mini');
      arrayFiltroValor.push(m.value.Mini.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (m.value.Descripcion != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{0,50})$/.test(m.value.Descripcion)) {
        this.showNotify.notify('danger', "Ingrese código de módulo válido.");
        this.loading = true;
        return false;
      }  
      arrayFiltroNombre.push('Descripcion');
      arrayFiltroValor.push(m.value.Descripcion.replace(/,/g,""));
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

  reset(m: NgForm){
    m.resetForm({
      CodigoModulo: '',
      Descripcion: '',
      Mini: ''
   });
  };

  actualizarOrden(modulo:Modulo, id:string){
    modulo.Orden = $('#'+id).val();
    this.moduloService.editarModulo(modulo).subscribe(
      response  => {
        this.handleMessage(response);
      },
      error =>  console.log(<any>error));
  }

   /**
   * 
   * @param modulo Inhabilitar
   */
  confimarInhabilitarModulo(modulo:Modulo){
    this.moduloHabilitado = modulo;
    $('#confirmar-inhabilitar').modal('show');
    this.arrayInhabilitarIds = [];
    this.arrayInhabilitarIds.push(modulo.IdModulo);
  }

  inhabilitarModulo(){
    this.spinnerService.set(true);
    this.objHabilitado = {};
    this.objHabilitado.Modulo = 'modulo';
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
      $('#confirmar-inhabilitar').modal('hide');
      $('#confirmar-activar').modal('hide');
      $('#confirmar-desactivar').modal('hide');
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
        this.listarModulo(this.paginaSeleccionada, this.mostrar);
        this.spinnerService.set(false);
      },2000);
    }else{
      console.log(response);
    }
  }
}
  