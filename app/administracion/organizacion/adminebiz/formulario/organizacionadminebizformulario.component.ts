import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { NgForm } from '@angular/forms';
//Model
import { Organizacion } from "app/@model/administracion/Organizacion";
import { Usuario } from "app/@model/administracion/Usuario";
import { Archivo } from "app/model/archivo";
import { GrupoEmpresarial } from 'app/@model/administracion/GrupoEmpresarial';
import { Rol } from 'app/@model/administracion/Rol';
import { UsuarioXOrganizacion } from 'app/@model/administracion/UsuarioXOrganizacion';
//Service
import { AdjuntoService } from "app/service/adjuntoservice";
import { OrganizacionService } from "app/@service/organizacion.service";
import { UsuarioXOrganizacionService } from "app/@service/usuarioxorganizacion.service";
import { GrupoEmpresarialService } from "app/@service/grupoempresarial.service";
import { UsuarioService } from "app/@service/usuario.service";
import { RolService } from "app/@service/rol.service";
import { HabilitadoService } from "app/@service/habilitado.service";
//Shape
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from 'app/@components/notify.component';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'organizacionadminebizformulario-cmp',
  templateUrl: './organizacionadminebizformulario.component.html',
  providers: [MasterService, 
    OrganizacionService, 
    GrupoEmpresarialService, 
    ShowNotify, 
    AdjuntoService,
    UsuarioService,
    UsuarioXOrganizacionService,
    RolService,
    HabilitadoService
  ]
})

export class OrganizacionAdminEbizFormularioComponent implements OnInit, AfterViewInit {

  title:string = "Crear organización";
  guardar:boolean = true;
  id: string = "";
  messages:any = [];
  listaRUC:any = [];
  util: AppUtils;
  dataLocalStorage:any;
  organizacion:Organizacion;
  gruposEmpresariales:any = [];
  TipoempresaC:string = '';
  TipoempresaP:string = 'P';
  TipoempresaF:string = '';
  mesensajeOrganizacionRegistrada:string = '';
  arraySearchParams:any = [];
  usuarios:any = [];
  usuario:Usuario;
  usuariosXOrganizacion:UsuarioXOrganizacion [] = [];
  //Grupoempresarial
  grupoEmpresarial:GrupoEmpresarial;
  opcionesCodigo:any = [];
  roles:any = [];
  arrayInhabilitarIds:any = [];
  usuarioXOrganizacionTemporal:UsuarioXOrganizacion;
  objHabilitado:any = {};
  //Fin GrupoEmpresarial
  public archivo: Archivo;

  arrayParamsCodigoGrupoEmpresarial:any = [{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 9999999},
    {'param': 'cabecera', 'value': 'IdGrupo,Descripcion'},
    {'param': 'filtro_nombre', 'value': 'Estado'},
    {'param': 'filtro_valor', 'value': 'ACTIV'},
    {'param': 'filtro_tipo', 'value': 'i'},
    {'param': 'orden', 'value': 'Descripcion,ASC'}];

  arrayParamsRucOrganizacion = [{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 9999999},
    {'param': 'cabecera', 'value': 'Ruc'}];
  
  arrayParamsRol = [{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 50},
    {'param': 'cabecera', 'value': 'IdRol,Descripcion'}];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private _masterService: MasterService, 
    private organizacionService: OrganizacionService,
    private grupoEmpresarialService: GrupoEmpresarialService,   
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private adjuntoService: AdjuntoService,
    private usuarioService: UsuarioService,
    private usuarioXOrganizacionService: UsuarioXOrganizacionService,
    private rolService: RolService,
    private habilitadoService: HabilitadoService
  ) {
    this.util = new AppUtils(this.router, this._masterService);
    this.organizacion = new Organizacion();
    this.grupoEmpresarial = new GrupoEmpresarial();
    this.archivo = new Archivo();
    this.usuario = new Usuario();
    this.usuarioXOrganizacionTemporal = new UsuarioXOrganizacion();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id != "nuevo") {
      this.title = "Editar organización"
      this.organizacionService.obtenerOrganizacionPorId(this.id).subscribe(
        res => {
          this.organizacion = res['data'];
          let tiposEmpresa = this.organizacion.TipoEmpresa.split(',');
          if (tiposEmpresa.length > 0) {
            this.TipoempresaC = '';
            this.TipoempresaP = '';
            this.TipoempresaF = '';   
          }
          tiposEmpresa.forEach(element => {
            if (element == 'C') { 
              this.TipoempresaC = 'C'; 
            }else if (element == 'P') { 
              this.TipoempresaP = 'P';            
            }else if (element == 'F') { 
              this.TipoempresaF = 'F';            
            }
          });
        }
      );

      this.rolService.obtenerListaRol(this.arrayParamsRol).subscribe( res => {
        this.roles = res.data;
      });

      this.obtenerUsuarioXOrganizacion(this.id);
      
    }

    this.obtenerGruposEmpresariales();

    this.organizacionService.obtenerListaOrganizacion(this.arrayParamsRucOrganizacion).subscribe(res => {
      this.listaRUC = res.data;
    })
    
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

  ngAfterViewInit() {}

  obtenerGruposEmpresariales(){
    this.grupoEmpresarialService.obtenerListaGrupoEmpresarial(this.arrayParamsCodigoGrupoEmpresarial).subscribe(res => {
      this.gruposEmpresariales = res.data;
    })
  }

  verificarRUC () {
    this.mesensajeOrganizacionRegistrada = '';
    if (this.organizacion.Ruc.length == 11) {
      for (let index = 0; index < this.listaRUC.length; index++) {
        let element = this.listaRUC[index];
        if (element.Ruc == this.organizacion.Ruc) {
          this.mesensajeOrganizacionRegistrada = 'Organización con el mismo RUC esta registrada.';
          break;
        }
      }
    }
  }

  onChangeFile(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.archivo.contenido = files[0];
    this.archivo.id = 1;
    this.archivo.descripcion = 'Imagen de organización';    
    let filename = new Date().getTime();
    this.archivo.nombre = filename.toString();
    this.archivo.nombreblob = 'org/' + localStorage.getItem('org_ruc') + '/logo/' + this.archivo.nombre;        
    this.archivo.url = this.adjuntoService.ObtenerUrlDescarga(this.archivo);
  }
  
  guardarOrganizacion(e){
    //this.inhabilitarForm();
    this.spinnerService.set(true);
    //this.guardar = false;

    if (this.archivo.url != null) {
      this.organizacion.Logo = this.archivo.url;
    }else if (this.organizacion.Logo == 'http://md-pro-angular2.creative-tim.com/assets/img/image_placeholder.jpg'){
      this.organizacion.Logo = '';
    }
    //Forzando vacio
    this.organizacion.Logo = '';
  
    if (this.TipoempresaC && this.TipoempresaP && this.TipoempresaF) {
      this.organizacion.TipoEmpresa = 'C,P,F';
    }else if (!this.TipoempresaC && this.TipoempresaP && this.TipoempresaF) {
      this.organizacion.TipoEmpresa = 'P,F';
    }else if (this.TipoempresaC && !this.TipoempresaP && this.TipoempresaF) {
      this.organizacion.TipoEmpresa = 'C,F';
    }else if (this.TipoempresaC && this.TipoempresaP && !this.TipoempresaF) {
      this.organizacion.TipoEmpresa = 'C,P';
    }else if (!this.TipoempresaC && !this.TipoempresaP && this.TipoempresaF) {
      this.organizacion.TipoEmpresa = 'F';
    }else if (!this.TipoempresaC && this.TipoempresaP && !this.TipoempresaF) {
      this.organizacion.TipoEmpresa = 'P';
    }else if (this.TipoempresaC && !this.TipoempresaP && !this.TipoempresaF) {
      this.organizacion.TipoEmpresa = 'C';
    }else{
      this.spinnerService.set(false);   
      this.showNotify.notify('danger', "Seleccione tipo de la organización.");
      //this.habilitarForm();
      //this.guardar = true;
      return false;
    }
    
    if(!/^([0-9]{11})$/.test(this.organizacion.Ruc)){
      this.spinnerService.set(false);   
      this.showNotify.notify('danger', "Ingrese número de RUC válido.");
      //this.habilitarForm();
      //this.guardar = true;
      return false;
    }
    
    if(!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9- .]{3,})$/.test(this.organizacion.Direccion)){
      this.spinnerService.set(false);   
      this.showNotify.notify('danger', "Ingrese dirección de organización válido.");
      return false;
    }

    if (!/^([A-Za-z-.]{1,})$/.test(this.organizacion.IsoPais)) {
      //this.habilitarForm();
      //this.guardar = true;
      this.spinnerService.set(false);   
      this.showNotify.notify('danger', "Seleccione pais de organización.");
      return false;
    }

    if (this.archivo.id == 1){
      this.adjuntoService.AgregarArchivo(this.archivo);
      this.organizacion.Logo = this.adjuntoService.ObtenerUrlDescarga(this.archivo);
    }

    /**
     * Inicio validaciones Jose R.
     */
    if (this.organizacion.Nombre != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{0,200})$/.test(this.organizacion.Nombre)) {
        //this.guardar = true;
        this.spinnerService.set(false);   
        this.showNotify.notify('danger', "Razón social es inválido.");
        return false;
    }
    if (this.organizacion.Url != '' && 
      !/^([a-z0-9-.]{0,150})$/.test(this.organizacion.Url)) {
        //this.guardar = true;
        this.spinnerService.set(false);   
        this.showNotify.notify('danger', "Url es inválido.");
        return false;
    }
    if (this.organizacion.Direccion != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9- .]{0,250})$/.test(this.organizacion.Direccion)) {
        //this.guardar = true;
        this.spinnerService.set(false);   
        this.showNotify.notify('danger', "Dirección fiscal es inválido.");
        return false;
    }
    if (this.organizacion.CodigoPostal != '' && 
      !/^([0-9]{0,6})$/.test(this.organizacion.CodigoPostal)) {
        //this.guardar = true;
        this.spinnerService.set(false);   
        this.showNotify.notify('danger', "Código postal es inválido.");
        return false;
    }
    if (this.organizacion.Ciudad != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9- .]{0,50})$/.test(this.organizacion.Ciudad)) {
        //this.guardar = true;
        this.spinnerService.set(false);   
        this.showNotify.notify('danger', "Ciudad es inválido.");
        return false;
    }
    if (this.organizacion.Provincia != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9- .]{0,50})$/.test(this.organizacion.Provincia)) {
        //this.guardar = true;
        this.spinnerService.set(false);   
        this.showNotify.notify('danger', "Provincia es inválido.");
        return false;
    }
    if (this.organizacion.Telefono != '' && 
      !/^([0-9-+() ]{0,15})$/.test(this.organizacion.Telefono)) {
        //this.guardar = true;
        this.spinnerService.set(false);   
        this.showNotify.notify('danger', "Número telefónico es inválido.");
        return false;
    }
    /**
     * Fin validaciones Jose R.
     */
    

    if (this.id != "nuevo") {
      this.organizacionService.editarOrganizacion(this.organizacion).subscribe(
        response  => {
          this.handleMessage(response);
          this.guardar = true;
        },
        error =>  console.log(<any>error));
    }else{
      for (let index = 0; index < this.listaRUC.length; index++) {
        let element = this.listaRUC[index];
        if (element.Ruc == this.organizacion.Ruc) {
          this.spinnerService.set(false);
          this.showNotify.notify('danger', "RUC se encuentra registrado.");
          //this.habilitarForm();          
          return false;
        }
      }
      this.organizacionService.crearOrganizacion(this.organizacion).subscribe(
        response  => {
          this.handleMessage(response);
        },
        error =>  console.log(<any>error));
    }
  }

  inhabilitarForm(){    
    $('#formulario').find('input, textarea, button, select, a').attr('disabled','disabled');
    $('#formulario-grupoempresarial').find('input, textarea, button, select, a').attr('disabled','disabled');
  }

  habilitarForm(){    
    $('#formulario').find('input, textarea, button, select, a').removeAttr('disabled');
    $('#formulario-grupoempresarial').find('input, textarea, button, select, a').removeAttr('disabled');
  }

  /**
   * GrupoEmpresarial
   */
  generarCodigo(){
    this.opcionesCodigo = [];
    let prefijo = "GE";
    let descripcionGrupoEmpresarial = this.grupoEmpresarial.Descripcion.toUpperCase();
    let arrayDescripcion:any = descripcionGrupoEmpresarial.split(' ');
    let codigoAutoGenerado:string = '';
    if (arrayDescripcion.length <= 1) {
      this.agregarOpcion(prefijo + descripcionGrupoEmpresarial.substr(0,4));      
      this.agregarOpcion(prefijo + descripcionGrupoEmpresarial.substr(descripcionGrupoEmpresarial.length - 4,4));
      this.agregarOpcion(prefijo + descripcionGrupoEmpresarial.substr(descripcionGrupoEmpresarial.length - 2,2) + descripcionGrupoEmpresarial.substr(0,2));
      this.agregarOpcion(prefijo + descripcionGrupoEmpresarial.substr(0,2) + descripcionGrupoEmpresarial.substr(descripcionGrupoEmpresarial.length - 2,2));
    }else{
      if (arrayDescripcion.length == 2) {
        this.agregarOpcion(prefijo + arrayDescripcion[0].substr(0,2) + arrayDescripcion[1].substr(0,2));
        this.agregarOpcion(prefijo + arrayDescripcion[1].substr(0,2) + arrayDescripcion[0].substr(0,2));
        this.agregarOpcion(prefijo + arrayDescripcion[1].substr(0,1) + arrayDescripcion[0].substr(0,1) + 'AS');
        this.agregarOpcion(prefijo + 'AS' + arrayDescripcion[1].substr(0,1) + arrayDescripcion[0].substr(0,1));
      }else if (arrayDescripcion.length == 3) {
        this.agregarOpcion(prefijo + arrayDescripcion[0].substr(0,2) + arrayDescripcion[1].substr(0,1) + arrayDescripcion[2].substr(0,1));
        this.agregarOpcion(prefijo + arrayDescripcion[0].substr(0,1) + arrayDescripcion[1].substr(0,2) + arrayDescripcion[2].substr(0,1));
        this.agregarOpcion(prefijo + arrayDescripcion[0].substr(0,1) + arrayDescripcion[1].substr(0,1) + arrayDescripcion[2].substr(0,2));
        this.agregarOpcion(prefijo + arrayDescripcion[1].substr(0,1) + arrayDescripcion[2].substr(0,1) + arrayDescripcion[0].substr(0,2));
      }else {
        this.agregarOpcion(prefijo + arrayDescripcion[0].substr(0,1) + arrayDescripcion[1].substr(0,1) + arrayDescripcion[2].substr(0,1) + arrayDescripcion[3].substr(0,1));
        this.agregarOpcion(prefijo + arrayDescripcion[1].substr(0,1) + arrayDescripcion[2].substr(0,1) + arrayDescripcion[3].substr(0,1) + arrayDescripcion[0].substr(0,1));
        this.agregarOpcion(prefijo + arrayDescripcion[2].substr(0,1) + arrayDescripcion[3].substr(0,1) + arrayDescripcion[0].substr(0,1) + arrayDescripcion[1].substr(0,1));
        this.agregarOpcion(prefijo + arrayDescripcion[3].substr(0,1) + arrayDescripcion[0].substr(0,1) + arrayDescripcion[1].substr(0,1) + arrayDescripcion[2].substr(0,1));
      }
    }
    for (let index = 0; index < this.gruposEmpresariales.length; index++) {
      let element = this.gruposEmpresariales[index];
      let posicion = this.opcionesCodigo.indexOf(element);
      if (posicion !== -1) {
        this.opcionesCodigo.splice(posicion, 1);
      }
    }
  }

  seleccionarOpcion(opcion){
    this.grupoEmpresarial.Codigo = opcion;
  }

  agregarOpcion(opcion){
    if (opcion.length == 6) {      
      let posicion = this.opcionesCodigo.indexOf(opcion);
      if (posicion !== -1) {
        if (this.opcionesCodigo.length == 1) {
          this.opcionesCodigo.push(opcion);
        }
      }else{
        this.opcionesCodigo.push(opcion);
      }   
    } 
  }

  guardarGrupoEmpresarial(){
    this.spinnerService.set(true);
    //this.inhabilitarForm();
    this.guardar = false;

    if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{4,})$/.test(this.grupoEmpresarial.Descripcion)) {
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese grupo empresarial válido.");
      //this.habilitarForm();      
      this.guardar = true;
      return false;
    }
    if (this.grupoEmpresarial.Codigo != "") {      
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9]{3,})$/.test(this.grupoEmpresarial.Codigo)) {
        this.spinnerService.set(false);
        this.showNotify.notify('danger', "Seleccione un código un de grupo empresarial válido.");
        //this.habilitarForm();
      this.guardar = true;
        return false;
      }
    }else{
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Seleccione un código un de grupo empresarial válido.");
      //this.habilitarForm();
      this.guardar = true;
      return false;
    }

    this.grupoEmpresarialService.crearGrupoEmpresarial(this.grupoEmpresarial).subscribe(
      response  => {
        $('#agregar-grupoempresarial').modal('hide');
        //this.habilitarForm();
        this.guardar = true;
        this.spinnerService.set(false);
        this.grupoEmpresarial = new GrupoEmpresarial();
        if (response.status == 202) {
          setTimeout(()=>{
            this.obtenerGruposEmpresariales();
          },2000);
        }else{
          this.showNotify.notify('success', "No se pudo guardar Grupo empresarial.");
        }
        
      },
      error =>  console.log(<any>error));   
  }

  /* Buscar Usuario */
  buscarUsuario(u: NgForm){    
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (u.value.Usuario != '') {
      arrayFiltroNombre.push('Usuario');
      arrayFiltroValor.push(u.value.Usuario.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (u.value.Nombre != '') {
      arrayFiltroNombre.push('Nombre');
      arrayFiltroValor.push(u.value.Nombre.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (u.value.ApellidoPaterno != '') {
      arrayFiltroNombre.push('ApellidoPaterno');
      arrayFiltroValor.push(u.value.ApellidoPaterno.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }

    arrayFiltroNombre.push('Estado');
    arrayFiltroValor.push('ACTIV');
    arrayFiltroTipo.push('i');

    if (arrayFiltroNombre.length > 0) {
      this.arraySearchParams.push({'param': 'filtro_nombre', 'value': arrayFiltroNombre.join(',')});
      this.arraySearchParams.push({'param': 'filtro_valor', 'value': arrayFiltroValor.join(',')});
      this.arraySearchParams.push({'param': 'filtro_tipo', 'value': arrayFiltroTipo.join(',')});
      this.mostrarResultadosBusquedaUsuario();
    }else{
      this.mostrarResultadosBusquedaUsuario();
    }
    
  }

  mostrarResultadosBusquedaUsuario(){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': 0});
    arrayParams.push({'param': 'mostrar', 'value': 10});
    arrayParams.push({'param': 'cabecera', 'value': 'IdUsuario,Nombre,ApellidoPaterno,ApellidoMaterno,Usuario'});
    arrayParams = arrayParams.concat(this.arraySearchParams);
    this.usuarioService.obtenerListaUsuario(arrayParams).subscribe(
      res => {
        this.usuarios = res.data;
      }
    );
  }

  reset(u: NgForm){
    u.resetForm({
      Usuario: '',
      Nombre: '',
      ApellidoPaterno: ''
   });
  };

  seleccionUsuario(usuario:Usuario){
    this.spinnerService.set(true);
    //this.inhabilitarForm();
    this.guardar = false;
    let usuarioXOrganizacion:UsuarioXOrganizacion = new UsuarioXOrganizacion();
    usuarioXOrganizacion.IdOrganizacion = this.id;
    usuarioXOrganizacion.IdUsuario = usuario.IdUsuario;
    //usuarioXOrganizacion.Usuario = usuario.Usuario;
    //usuarioXOrganizacion.IdRol = '21bcf7ed-edcb-4c74-8f41-20b9e2fbc9d5';    
    //usuarioXOrganizacion.NombreCompleto = usuario.ApellidoPaterno.toUpperCase() + ' ' + usuario.ApellidoMaterno.toUpperCase() + ', '+ usuario.Nombre;   
    this.usuarioXOrganizacionService.crearUsuarioXOrganizacion(usuarioXOrganizacion).subscribe(
      res  => {
        $('#buscar-usuario').modal('hide');
        if (res.status == 202) {
          if (this.id != 'nuevo') {
            setTimeout(()=>{
              this.obtenerUsuarioXOrganizacion(this.id);
            },2000);            
          }
        }else{
          this.showNotify.notify('success', "No se pudo registrar usuario a organización.");
        }        
      },
      error =>  console.log(<any>error));
    
  }

  obtenerUsuarioXOrganizacion(IdOrganizacion){
    let arrayParamsUsuarioXOrganizacion:any = [{'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 99},
      {'param': 'cabecera', 'value': 'IdUsuarioXOrganizacion,IdOrganizacion,IdUsuario,IdRol,Cargo,CodigoInterno,Estado,Usuario,Rol,NombreCompleto'},
      {'param': 'filtro_nombre', 'value': 'IdOrganizacion'},
      {'param': 'filtro_valor', 'value': this.id},
      {'param': 'filtro_tipo', 'value': 'i'},
      {'param': 'orden', 'value': 'NombreCompleto,DESC'}];
      this.usuarioXOrganizacionService.obtenerListaUsuarioXOrganizacion(arrayParamsUsuarioXOrganizacion).subscribe( res => {
        this.usuariosXOrganizacion = res.data;
        this.spinnerService.set(false);
        //this.habilitarForm();       
        this.guardar = false; 
      });   
  }

  confimarInhabilitarUsuario(usuarioXOrganizacion:UsuarioXOrganizacion){
    this.arrayInhabilitarIds = [];
    $('#confirmar-inhabilitar').modal('show');
    this.usuarioXOrganizacionTemporal = usuarioXOrganizacion;
    this.arrayInhabilitarIds.push(usuarioXOrganizacion.IdUsuarioXOrganizacion);
  }

  inhabilitarUsuario(){
    this.spinnerService.set(true);
    this.objHabilitado = {};
    this.objHabilitado.Modulo = 'usuarioxorganizacion';
    this.objHabilitado.Habilitado = 0;
    this.objHabilitado.Ids = this.arrayInhabilitarIds;      
    this.habilitadoService.cambiarHabilitado(this.objHabilitado).subscribe(
      res  => {
        if (res.status == 202) {
          if (this.id != 'nuevo') {
            $('#confirmar-inhabilitar').modal('hide');
            setTimeout(()=>{
              this.obtenerUsuarioXOrganizacion(this.id);
            },2000);          
          }
        }else{
          this.showNotify.notify('success', "No se pudo registrar usuario a organización.");
        }         
      },
      error =>  console.log(<any>error));    
  }

  cambiarRolUsuario(IdUsuarioXOrganizacion){
    if (this.id != 'nuevo') {
      $('#'+IdUsuarioXOrganizacion).attr('disabled','disabled');
      let idRol = $('#'+IdUsuarioXOrganizacion).val();
      let usuarioXOrganizacionRol = new UsuarioXOrganizacion();
      usuarioXOrganizacionRol.IdUsuarioXOrganizacion = IdUsuarioXOrganizacion;
      usuarioXOrganizacionRol.IdRol = idRol;      
      this.usuarioXOrganizacionService.editarUsuarioXOrganizacion(usuarioXOrganizacionRol).subscribe( res => {
        if (res.status == 202) {          
          $('#'+IdUsuarioXOrganizacion).removeAttr('disabled');
        }else{
          this.showNotify.notify('danger', "No se pudo registrar rol usuario.");
        }  
      }); 
    }
  } 
  
  activarEditar(){
    this.guardar = true;
  }
  
  handleMessage(response)
  {
    if (response.status == 202) {
      setTimeout(()=>{
        this.spinnerService.set(false);
        this.router.navigate(['organizacion/adminebiz/buscar']);
      },2000);
    }else{
      this.showNotify.notify('success', "No se pudo actualizar Organización.");
    }
	}

}
