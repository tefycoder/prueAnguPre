import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { AppUtils } from "app/utils/app.utils";
//Modeñ
import { Archivo } from "app/model/archivo";
import { Usuario } from 'app/@model/administracion/Usuario';
//Service
import { MasterService } from 'app/service/masterservice';
import { AdjuntoService } from "app/service/adjuntoservice";
import { UsuarioService } from "app/@service/usuario.service";
//Shape
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from 'app/@components/notify.component';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'usuarioadminebizformulario-cmp',
  templateUrl: './usuarioadminebizformulario.component.html',
  providers: [
    MasterService, 
    UsuarioService, 
    ShowNotify,
    AdjuntoService
  ]
})

export class UsuarioAdminEbizFormularioComponent implements OnInit{
  title:string = "Crear usuario";
  guardar:boolean = true;
  id: string = "";
  messages:any = [];
  util: AppUtils;
  usuario:Usuario;
  mesensajePosibleUsuarioRegistrado:string = '';
  gruposEmpresariales:any = [];
  opcionesUsuario:any = [];
  opcionesUsuarioUsuarioEnBaseDatos:any = [];
  archivo: Archivo;
  arrayParamsUsuarioUsuario:any = [{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 9999999},
    {'param': 'cabecera', 'value': 'IdUsuario,Usuario'},
    {'param': 'filtro_nombre', 'value': 'Estado'},
    {'param': 'filtro_valor', 'value': 'ACTIV'},
    {'param': 'filtro_tipo', 'value': 'i'},
    {'param': 'orden', 'value': 'Usuario,ASC'}];
  HabilitadoEnvioEmail:boolean = true;
  HabilitadoEnvioSms:boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private _masterService: MasterService, 
    private usuarioService: UsuarioService,
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private adjuntoService: AdjuntoService,
  ) {
    this.util = new AppUtils(this.router, this._masterService);
    this.usuario = new Usuario();
    this.archivo = new Archivo();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id != "nuevo") {
      this.guardar = false;  
      this.title = "Editar usuario";
      this.usuarioService.obtenerUsuarioPorId(this.id).subscribe(
        res => {
          this.usuario = res['data'];
          if (this.usuario.HabilitadoEnvioEmail == 1) {
            this.HabilitadoEnvioEmail = true;
          }else{
            this.HabilitadoEnvioEmail = false;
          }
          if (this.usuario.HabilitadoEnvioSms == 1) {
            this.HabilitadoEnvioSms = true;
          }else{
            this.HabilitadoEnvioSms = false;
          }
          
        }
      );
    }

    this.usuarioService.obtenerListaUsuario(this.arrayParamsUsuarioUsuario).subscribe(res => {
      this.opcionesUsuarioUsuarioEnBaseDatos = res.data;
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
    console.log(this.archivo.nombreblob);      
    this.archivo.url = this.adjuntoService.ObtenerUrlDescarga(this.archivo);
    //console.log();
    this.usuario.Avatar = this.archivo.url;
    //console.log(this.adjuntoService.DescargarArchivo(this.archivo).toPromise());

  }

  generarUsuario(){
    let primeraLetraNombre = '';
    this.opcionesUsuario = []; 
    this.agregarOpcion(this.usuario.Nombre.substr(0,1) + this.usuario.ApellidoPaterno);
    if (this.usuario.ApellidoMaterno != "") {
      this.agregarOpcion(this.usuario.Nombre.substr(0,1) + this.usuario.ApellidoPaterno + this.usuario.ApellidoMaterno.substr(0,1));
    }
    let arrayNombre:any = this.usuario.Nombre.split(' ');
    let arrayApellidoPaterno:any = this.usuario.ApellidoPaterno.split(' ');
    let arrayApellidoMaterno:any = this.usuario.ApellidoMaterno.split(' ');
    if (arrayNombre.length > 1) {
      arrayNombre.forEach(element => {
        primeraLetraNombre += element.substr(0,1);
      });
      this.agregarOpcion(primeraLetraNombre + this.usuario.ApellidoPaterno);
      if (this.usuario.ApellidoMaterno != "") {
        this.agregarOpcion(primeraLetraNombre + this.usuario.ApellidoPaterno + this.usuario.ApellidoMaterno.substr(0,1));
      }
    }
    
    this.mesensajePosibleUsuarioRegistrado = '';

    for (let index = 0; index < this.opcionesUsuarioUsuarioEnBaseDatos.length; index++) {
      let element = this.opcionesUsuarioUsuarioEnBaseDatos[index];
      let posicion = this.opcionesUsuario.indexOf(element);
      if (posicion !== -1) {
        this.opcionesUsuario.splice(posicion, 1);
        this.mesensajePosibleUsuarioRegistrado = 'Usuario podria estar registrado. Por favor verifique.';
      }
    }
  }

  seleccionarOpcion(opcion){
    this.usuario.Usuario = opcion;
  }

  agregarOpcion(opcion){
    opcion = opcion.replace(/ /gi, '');
    opcion = opcion.toUpperCase();
    let posicion = this.opcionesUsuario.indexOf(opcion);
    if (posicion !== -1) {
      if (this.opcionesUsuario.length == 1) {
        this.opcionesUsuario.push(opcion);
      }
    }else{
      this.opcionesUsuario.push(opcion);
    }    
  }

  guardarUsuario(){
    //this.inhabilitarForm();
    this.spinnerService.set(true); 
    //this.guardar = false; 
    if (this.usuario.HabilitadoEnvioEmail != 1) {
      this.usuario.HabilitadoEnvioEmail = 0;
    }  
    if (this.usuario.HabilitadoEnvioSms != 1) {
      this.usuario.HabilitadoEnvioSms = 0;
    }  
    if (this.HabilitadoEnvioEmail == true) {
      this.usuario.HabilitadoEnvioEmail = 1;
    }else{
      this.usuario.HabilitadoEnvioEmail = 0;
    } 
    if (this.HabilitadoEnvioSms == true) {
      this.usuario.HabilitadoEnvioSms = 1;
    }else{
      this.usuario.HabilitadoEnvioSms = 0;
    }

    if (this.usuario.HabilitadoEnvioSms == 0 && this.usuario.HabilitadoEnvioEmail == 0) {
      //this.habilitarForm();
      this.spinnerService.set(false);
      //this.guardar = true;   
      this.showNotify.notify('danger', "Seleccione medio de notificaciones (SMS - E-mail).");
      return false;
    }    
    

    if (this.archivo.url != null) {
      this.usuario.Avatar = this.archivo.url;
    }else if (this.usuario.Avatar == 'http://md-pro-angular2.creative-tim.com/assets/img/image_placeholder.jpg'){
      this.usuario.Avatar = '';
    } 
    //Forzando vacio
    this.usuario.Avatar = '';

    if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9]{2,30})$/.test(this.usuario.Usuario)) {
      //this.habilitarForm();
      this.spinnerService.set(false); 
      //this.guardar = true;  
      this.showNotify.notify('danger', "Seleccione usuario válido.");
      return false;
    }
    if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{2,40})$/.test(this.usuario.ApellidoPaterno)) {
      //this.habilitarForm();
      this.spinnerService.set(false);
      //this.guardar = true;   
      this.showNotify.notify('danger', "Ingrese apellido paterno válido.");
      return false;
    }
    if (!/^([A-Za-z-.]{1,})$/.test(this.usuario.Titulo)) {
      //this.habilitarForm();
      this.spinnerService.set(false);  
      //this.guardar = true; 
      this.showNotify.notify('danger', "Seleccione titulo de usuario.");
      return false;
    }    
    if (!/^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$)$/.test(this.usuario.Email)) {
      //this.habilitarForm();
      this.spinnerService.set(false);   
      //this.guardar = true;
      this.showNotify.notify('danger', "Ingrese correo electrónico válido.");
      return false;
    } 
    if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{3,50})$/.test(this.usuario.Direccion)) {
      //this.habilitarForm();
      this.spinnerService.set(false);  
      //this.guardar = true; 
      this.showNotify.notify('danger', "Ingrese dirección válida.");
      return false;
    }  

    /**
     * Inicio validaciones Jose R.
     */
    if (this.usuario.ApellidoMaterno != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{0,40})$/.test(this.usuario.ApellidoMaterno)) {
        this.spinnerService.set(false);   
        //this.guardar = true;
        this.showNotify.notify('danger', "Apellido materno es inválido.");
        return false;
    }
    if (this.usuario.Nombre != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{0,40})$/.test(this.usuario.Nombre)) {
        this.spinnerService.set(false); 
        //this.guardar = true;  
        this.showNotify.notify('danger', "Nombre de usuario es inválido.");
        return false;
    }
    if (this.usuario.Telefono != '' && 
      !/^([0-9-+() ]{0,15})$/.test(this.usuario.Telefono)) {
        this.spinnerService.set(false);   
        //this.guardar = true;
        this.showNotify.notify('danger', "Teléfono es inválido.");
        return false;
    }
    if (this.usuario.Cargo != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{0,30})$/.test(this.usuario.Cargo)) {
        this.spinnerService.set(false);  
        //this.guardar = true; 
        this.showNotify.notify('danger', "Cargo es inválido.");
        return false;
    }
    if (this.usuario.NumeroDocumento != '' && 
      !/^([0-9]{8,10})$/.test(this.usuario.NumeroDocumento)) {
        this.spinnerService.set(false);  
        //this.guardar = true; 
        this.showNotify.notify('danger', "Cargo es inválido.");
        return false;
    }
    if (/^([0-9]{8,10})$/.test(this.usuario.NumeroDocumento)) {      
      switch(this.usuario.TipoDocumento){
        case 'DNI':
          if (this.usuario.NumeroDocumento.length != 8) {
            this.spinnerService.set(false);
            //this.guardar = true; 
            this.showNotify.notify('danger', "Documento de identidad debe tener 8 dígitos.");
            return false;
          }
          break;
        case 'Carnet':
        console.log(this.usuario.TipoDocumento);
          if (this.usuario.NumeroDocumento.length != 10) {
            this.spinnerService.set(false);
            //this.guardar = true; 
            this.showNotify.notify('danger', "Carnet de extranjería debe tener 10 dígitos.");
            return false;
          }
          break;
        case 'n':
          this.usuario.TipoDocumento = '';
          this.usuario.NumeroDocumento = '';
          break;
      }
    }
    if (this.usuario.Ciudad != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{0,30})$/.test(this.usuario.Ciudad)) {
        this.spinnerService.set(false);   
        //this.guardar = true;
        this.showNotify.notify('danger', "Ciudad es inválido.");
        return false;
    }
    if (this.usuario.Provincia != '' && 
      !/^([A-Za-zñÑáÁéÉíÍóÓúÚ ]{0,30})$/.test(this.usuario.Provincia)) {
        this.spinnerService.set(false);   
        //this.guardar = true;
        this.showNotify.notify('danger', "Provincia es inválido.");
        return false;
    }
    /**
     * Inicio validaciones Jose R.
     */

    if (this.id != "nuevo") {
      this.usuario.IdUsuario = this.id;
      this.usuarioService.editarUsuario(this.usuario).subscribe(
        response  => {
          this.handleMessage(response);
          this.guardar = true;
        },
        error =>  console.log(<any>error));
    }else{
      this.usuarioService.crearUsuario(this.usuario).subscribe(
        response  => {
          this.handleMessage(response);
        },
        error =>  console.log(<any>error));
    }

  }

  inhabilitarForm(){    
    //$('#formulario').find('input, textarea, button, select, a').attr('disabled','disabled');
  }

  habilitarForm(){    
    //$('#formulario').find('input, textarea, button, select, a').removeAttr('disabled');
  }

  handleMessage(response)
  {
    if (response.status == 202) { 
      setTimeout(()=>{
        this.spinnerService.set(false);
        this.router.navigate(['usuario/adminebiz/buscar']);
      },2000);
    }else{
      this.showNotify.notify('success', "No se pudo actualizar Usuario.");
    }
	}

  activarEditar(){
    this.guardar = true;
  }
}
