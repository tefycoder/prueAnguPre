import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { NgForm } from '@angular/forms';
//Model
import { Usuario } from "app/@model/administracion/Usuario";
//Service
import { UsuarioService } from "app/@service/usuario.service";
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
  selector: 'usuarioadminebizbuscar-cmp',
  templateUrl: './usuarioadminebizbuscar.component.html',
  providers: [
    MasterService, 
    UsuarioService, 
    EstadoService,
    HabilitadoService,
    ShowNotify
  ]
})

export class UsuarioAdminEbizBuscarComponent implements OnInit {
  util: AppUtils;
  /* Objeto Usuario */
  usuarios:any = [];
  arrayCambioEstadoIds:any = [];
  objEstado:any = {};
  loading = false;
  filtro_nombre:string;
  filtro_valor:string;
  filtro_tipo:string;
  ordenar:string;
  ordenarCount:number = 0;
  /* Inhabilitar */
  usuarioHabilitado:Usuario;
  objHabilitado:any = {};
  arrayInhabilitarIds:any = [];
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
  /* Constructor */
  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private masterService: MasterService,
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private usuarioService: UsuarioService,
    private estadoService: EstadoService,
    private habilitadoService: HabilitadoService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.usuarioHabilitado = new Usuario();
  }

  ngOnInit() {
    this.listarUsuario(this.paginaSeleccionada, this.mostrar);
  }

  listarUsuario(pagina, mostrar){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': pagina});
    arrayParams.push({'param': 'mostrar', 'value': mostrar});
    arrayParams.push({'param': 'cabecera', 'value': 'IdUsuario,Usuario,ApellidoPaterno,ApellidoMaterno,Nombre,Email,Estado'});
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
    this.usuarioService.obtenerListaUsuario(arrayParams).subscribe(
      res => {        
        this.loading = true;
        this.usuarios = res.data;
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
    this.listarUsuario(seleccion, this.mostrar);
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
      this.showNotify.notify('warning', "Seleccione usuario(s) a cambiar de estado.");
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
       this.objEstado.Modulo = 'usuario';
       this.objEstado.Estado = estado;
       this.objEstado.Ids = this.arrayCambioEstadoIds;
       this.usuarios.forEach(usuario => {
        this.objEstado.Ids.forEach(id => {
          if (usuario.IdUsuario == id) {
            usuario.Estado = estado;
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
  buscarUsuario(u: NgForm){    
    this.loading = false;
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (u.value.Usuario != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9]{0,30})$/.test(u.value.Usuario)) {
        this.showNotify.notify('danger', "Ingrese usuario válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('Usuario');
      arrayFiltroValor.push(u.value.Usuario.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (u.value.Nombre != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{0,30})$/.test(u.value.Nombre)) {
        this.showNotify.notify('danger', "Ingrese nombre de usuario válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('Nombre');
      arrayFiltroValor.push(u.value.Nombre.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (u.value.ApellidoPaterno != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{0,30})$/.test(u.value.ApellidoPaterno)) {
        this.showNotify.notify('danger', "Ingrese apellido paterno de usuario válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('ApellidoPaterno');
      arrayFiltroValor.push(u.value.ApellidoPaterno.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (u.value.ApellidoMaterno != '') {
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{0,30})$/.test(u.value.ApellidoMaterno)) {
        this.showNotify.notify('danger', "Ingrese apellido materno de usuario válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('ApellidoMaterno');
      arrayFiltroValor.push(u.value.ApellidoMaterno.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (u.value.NumeroDocumento != '') {
      if (!/^([0-9]{0,8})$/.test(u.value.NumeroDocumento)) {
        this.showNotify.notify('danger', "Ingrese número de documento válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('NumeroDocumento');
      arrayFiltroValor.push(u.value.NumeroDocumento.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (u.value.Email != '') {
      if (!/^([A-Za-z0-9@._]{0,50})$/.test(u.value.Email)) {
        this.showNotify.notify('danger', "Ingrese correo eletrónico de usuario válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('Email');
      arrayFiltroValor.push(u.value.Email.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (u.value.Telefono != '') {
      if (!/^([0-9-+() ]{0,15})$/.test(u.value.Telefono)) {
        this.showNotify.notify('danger', "Ingrese teléfono válido.");
        this.loading = true;
        return false;
      } 
      arrayFiltroNombre.push('Telefono');
      arrayFiltroValor.push(u.value.Telefono.replace(/,/g,""));
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

  reset(u: NgForm){
    u.resetForm({
      Usuario: '',
      Nombre: '',
      ApellidoPaterno: '',
      ApellidoMaterno: '',
      NumeroDocumento: '',
      Email: '',
      Telefono: ''
   });
  };
  
  /**
   * 
   * @param usuario Inhabilitar
   */
  confimarInhabilitarUsuario(usuario:Usuario){
    this.usuarioHabilitado = usuario;
    $('#confirmar-inhabilitar').modal('show');
    this.arrayInhabilitarIds = [];
    this.arrayInhabilitarIds.push(usuario.IdUsuario);
  }

  inhabilitarUsuario(){
    this.spinnerService.set(true); 
    this.objHabilitado = {};
    this.objHabilitado.Modulo = 'usuario';
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
        this.listarUsuario(this.paginaSeleccionada, this.mostrar);
        this.spinnerService.set(false);
      },2000);
    }else{
      console.log(response);
    }
  }

}
  