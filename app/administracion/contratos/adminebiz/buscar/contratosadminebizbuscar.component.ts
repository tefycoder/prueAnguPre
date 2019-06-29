import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { NgForm } from '@angular/forms';
//Model
import { Contrato } from "app/@model/administracion/Contrato";
//Service
import { ContratoService } from "app/@service/contrato.service";
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
  selector: 'contratosadminebizbuscar-cmp',
  templateUrl: './contratosadminebizbuscar.component.html',
  providers: [
    MasterService, 
    ContratoService, 
    EstadoService, 
    HabilitadoService,
    ShowNotify]
})

export class ContratosAdminEbizBuscarComponent implements OnInit {  
  util: AppUtils;
  /* Objeto Grupo Empresarial */
  contratos:any = [];
  arrayCambioEstadoIds:any = [];
  objEstado:any = {};
  loading = false;
  filtro_nombre:string;
  filtro_valor:string;
  filtro_tipo:string;
  ordenar:string;
  ordenarCount:number = 0;
  //contrato: any = {}
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.route });
  }
  /* Datos de tabla */
  paginas:any = [];
  paginaSeleccionada:any = PAGINA_INICIAL;
  mostrarResultados:any = MOSTRAR_RESULTADOS;
  mostrar:number = MOSTRAR;
  registros:number;
  arraySearchParams:any = [];
  /* Inhabilitar */
  contratoHabilitado:Contrato;
  objHabilitado:any = {};
  arrayInhabilitarIds:any = [];
  /* Constructor */
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private masterService: MasterService,
    private contratoService: ContratoService,
    private estadoService: EstadoService,
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private habilitadoService: HabilitadoService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.contratoHabilitado = new Contrato();
  }

  ngOnInit() {
    this.listarContrato(this.paginaSeleccionada, this.mostrar);
  }

  listarContrato(pagina, mostrar){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': pagina});
    arrayParams.push({'param': 'mostrar', 'value': mostrar});
    arrayParams.push({'param': 'cabecera', 'value': 'IdContrato,IdOrganizacion,Organizacion,Numero,CantidadUsuarios,TipoEmpresa'});

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
    this.contratoService.obtenerListaContrato(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.contratos = res.data;
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
    this.listarContrato(seleccion, this.mostrar);
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
      this.showNotify.notify('warning', "Seleccione contrato a cambiar de estado.");
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
        this.objEstado.Modulo = 'contrato';
        this.objEstado.Estado = estado;
        this.objEstado.Ids = this.arrayCambioEstadoIds;
        this.contratos.forEach(contrato => {
          this.objEstado.Ids.forEach(id => {
            if (contrato.IdContrato == id) {
              //contrato.Estado = estado;
             }
          });
         });
        this.estadoService.cambiarEstado(this.objEstado).subscribe(
          response  => {
            this.handleMessage(response);
            $('#seleccionar-todos').prop( "checked", false );
            $('#confirmar-activar').modal('hide');
            $('#confirmar-desactivar').modal('hide');
            setTimeout(()=>{          
              this.listarContrato(this.paginaSeleccionada, this.mostrar);
              this.spinnerService.set(false);
            },500);
          },
          error =>  console.log(<any>error));
    }
  }

  /* Buscar Grupo Empresarial */
  buscarContrato(c: NgForm){    
    this.loading = false;
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (c.value.Numero != '') {
      if (!/^([0-9]{0,11})$/.test(c.value.Numero)) {
        this.showNotify.notify('danger', "Ingrese número de contrato válido.");
        this.loading = true;
        return false;
      }    
      arrayFiltroNombre.push('Numero');
      arrayFiltroValor.push(c.value.Numero.replace(/,/g,""));
      arrayFiltroTipo.push('i');
    }
    if (c.value.Ruc != '') {
      if (!/^([0-9]{0,11})$/.test(c.value.Ruc)) {
        this.showNotify.notify('danger', "Ingrese RUC de organización válido.");
        this.loading = true;
        return false;
      }    
      arrayFiltroNombre.push('Ruc');
      arrayFiltroValor.push(c.value.Ruc.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (c.value.Organizacion != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{0,50})$/.test(c.value.Organizacion)) {
        this.showNotify.notify('danger', "Ingrese razón social válida.");
        this.loading = true;
        return false;
      }    
      arrayFiltroNombre.push('Organizacion');
      arrayFiltroValor.push(c.value.Organizacion.replace(/,/g,""));
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

  reset(c: NgForm){    
    c.resetForm({
      Numero: '',
      Ruc: '',
      Organizacion: ''
    });
  };

  handleMessage(response)
  {
    if (response.status == 202) {
    }else{
      console.log(response);
    }
  }

  /**
   * 
   * @param contrato Inhabilitar
   */
  confimarInhabilitarContrato(contrato:Contrato){
    this.contratoHabilitado = contrato;
    $('#confirmar-inhabilitar').modal('show');
    this.arrayInhabilitarIds = [];
    this.arrayInhabilitarIds.push(contrato.IdContrato);
  }

  inhabilitarContrato(){
    this.spinnerService.set(true);
    this.objHabilitado = {};
    this.objHabilitado.Modulo = 'contrato';
    this.objHabilitado.Habilitado = 0;
    this.objHabilitado.Ids = this.arrayInhabilitarIds;    
    this.habilitadoService.cambiarHabilitado(this.objHabilitado).subscribe(
      response  => {
        this.handleMessage(response);
        $('#confirmar-inhabilitar').modal('hide');
        setTimeout(()=>{          
          this.cambiarResultadosMostrar();
          this.spinnerService.set(false);
        },2000);
      },
      error =>  console.log(<any>error));
  }
}
  

