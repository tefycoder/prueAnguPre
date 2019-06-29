import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
//Model
import { Boton } from "app/@model/administracion/Boton";
import { Modulo } from "app/@model/administracion/Modulo";
import { ModuloXUrl } from "app/@model/administracion/ModuloXUrl";
import { ModuloXBoton } from "app/@model/administracion/ModuloXBoton";
import { UiModuloUrlBoton } from "app/@model/administracion/ui/UimoduloUrlBoton";
//Service
import { BotonService } from 'app/@service/boton.service';
import { ModuloService } from 'app/@service/modulo.service';
import { ModuloXBotonService } from 'app/@service/moduloxboton.service';
import { ModuloXUrlService } from 'app/@service/moduloxurl.service';
import { UiModuloUrlBotonService } from 'app/@service/uimodulourlboton.service';
import { SpinnerService } from 'app/service/spinner.service';
//Shape
import { ShowNotify } from 'app/@components/notify.component';

declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'moduloadminebizformulario-cmp',
  templateUrl: './moduloadminebizformulario.component.html',
  providers: [
    MasterService, 
    ShowNotify, 
    BotonService, 
    UiModuloUrlBotonService, 
    ModuloService, 
    ModuloXUrlService, 
    ModuloXBotonService]
})

export class ModuloAdminEbizFormularioComponent implements OnInit, AfterViewInit {
  title:string = 'Crear módulo';
  util: AppUtils;
  guardar:boolean = true;
  id: string = "";
  uiModuloUrlBoton:UiModuloUrlBoton;
  modulo:Modulo;
  moduloXUrlComprador:ModuloXUrl;
  moduloXUrlProveedor:ModuloXUrl;
  moduloXUrlFactor:ModuloXUrl;
  moduloXBoton:ModuloXBoton;
  botonesDisponibles:Boton[] = [];
  botonesSeleccionadosComprador:Boton [] = [];
  botonesSeleccionadosProveedor:Boton [] = [];
  botonesSeleccionadosFactor:Boton [] = [];
  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private masterService: MasterService,
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private botonService: BotonService,
    private uiModuloUrlBotonService: UiModuloUrlBotonService,
    private moduloService: ModuloService, 
    private moduloXUrlService: ModuloXUrlService, 
    private moduloXBotonService: ModuloXBotonService,
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.uiModuloUrlBoton = new UiModuloUrlBoton();

    this.modulo = new Modulo();

    this.moduloXUrlComprador = new ModuloXUrl();
    this.moduloXUrlProveedor = new ModuloXUrl();
    this.moduloXUrlFactor = new ModuloXUrl();    
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.botonService.obtenerListaBoton().subscribe(
      botonDisponible => { 
        this.botonesDisponibles = botonDisponible.data;
      }
    );

    if (this.id != "nuevo") {
      this.guardar = false;
      this.title = 'Editar módulo';   
      let arrayParamsModuloXUrl = [
      {'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 9999999},
      {'param': 'cabecera', 'value': 'IdModuloXUrl,IdModulo,Descripcion,Url,Perfil,Habilitado,Estado'},
      {'param': 'filtro_nombre', 'value': 'IdModulo'},
      {'param': 'filtro_valor', 'value': this.id},
      {'param': 'filtro_tipo', 'value': 'i'}];
      let arrayParamsModuloXBoton = [
      {'param': 'pagina', 'value': 0},
      {'param': 'mostrar', 'value': 9999999},
      {'param': 'cabecera', 'value': 'IdModuloXBoton,IdModulo,IdBoton,Habilitado,Perfil,Estado'},
      {'param': 'filtro_nombre', 'value': 'IdModulo'},
      {'param': 'filtro_valor', 'value': this.id},
      {'param': 'filtro_tipo', 'value': 'i'}];

      this.moduloService.obtenerModuloPorId(this.id).subscribe(
        res => {
          this.modulo = res['data'];

          this.moduloXUrlService.obtenerListaModuloXUrl(arrayParamsModuloXUrl).subscribe(
            res => {
              let arrayModuloXUrl:any = res['data'];              
              arrayModuloXUrl.forEach(element => {
                if (element.Perfil == 'C') {
                  this.moduloXUrlComprador = element;
                }else if (element.Perfil == 'P') {
                  this.moduloXUrlProveedor = element;                  
                }else if (element.Perfil == 'F') {
                  this.moduloXUrlFactor = element;                  
                }
              });              
            }
          )

          this.moduloXBotonService.obtenerListaModuloXBoton(arrayParamsModuloXBoton).subscribe(
            ress => {
              let arrayModuloXBoton:any = ress['data'];
              arrayModuloXBoton.forEach(element => {
                this.botonesDisponibles.forEach(boton => {
                  if (boton.IdBoton == element.IdBoton && element.Perfil == 'C') {
                    this.selecionarComprador(boton);
                  }else if (boton.IdBoton == element.IdBoton && element.Perfil == 'P') {
                    this.selecionarProveedor(boton);
                  }else if (boton.IdBoton == element.IdBoton && element.Perfil == 'F') {
                    this.selecionarFactor(boton);
                  }
                });
              });
            }
          )

        }
      );
    }

  }
  
  ngAfterViewInit() {  
  }

  ngAfterViewChecked(){
    $("input").each(function () {
      if ($(this).val() != ''){
        $(this.parentElement).removeClass("is-empty");
      }else{
        $(this.parentElement).addClass("is-empty");
      }
    });
  }

  seleccionComprador(boton:Boton):boolean{
    let posicion = this.botonesSeleccionadosComprador.indexOf(boton);
    if (posicion !== -1) {
      return true;
    }
    return false;
  }

  seleccionProveedor(boton:Boton):boolean{
    let posicion = this.botonesSeleccionadosProveedor.indexOf(boton);
    if (posicion !== -1) {
      return true;
    }
    return false;
  }

  seleccionFactor(boton:Boton):boolean{
    let posicion = this.botonesSeleccionadosFactor.indexOf(boton);
    if (posicion !== -1) {
      return true;
    }
    return false;
  }
  selecionarProveedor(boton:Boton){
    let posicion = this.botonesSeleccionadosProveedor.indexOf(boton);
    if (posicion === -1) {
      this.botonesSeleccionadosProveedor.push(boton);
    }else{      
      this.botonesSeleccionadosProveedor.splice(posicion, 1);
    }
  }
  selecionarFactor(boton:Boton){
    let posicion = this.botonesSeleccionadosFactor.indexOf(boton);
    if (posicion === -1) {
      this.botonesSeleccionadosFactor.push(boton);
    }else{      
      this.botonesSeleccionadosFactor.splice(posicion, 1);
    }
  }

  selecionarComprador(boton:Boton){
    let posicion = this.botonesSeleccionadosComprador.indexOf(boton);
    if (posicion === -1) {
      this.botonesSeleccionadosComprador.push(boton);
    }else{      
      this.botonesSeleccionadosComprador.splice(posicion, 1);
    }
  }

  guardarModulo(){
    this.spinnerService.set(true);
    this.inhabilitarForm();
    if (!/^([A-Z0-9]{1,10})$/.test(this.modulo.CodigoModulo)) {
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese código de módulo válido.");
      this.habilitarForm();
      return false;
    }
    if (!/^([A-Z]{1,3})$/.test(this.modulo.Mini)) {
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese nombre abreviado de módulo válido.");
      this.habilitarForm();
      return false;
    }
    if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{1,50})$/.test(this.modulo.Descripcion)) {
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese nombre de módulo válido.");
      this.habilitarForm();
      return false;
    }
    if (!/^([0-9]{1,3})$/.test(this.modulo.Orden.toString())) {
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese número de orden válido.");
      this.habilitarForm();
      return false;
    }


    this.uiModuloUrlBoton.Modulo = this.modulo;
    let arrayUiModuloUrl:ModuloXUrl[] = [];
    this.moduloXUrlComprador.Perfil='C';
    this.moduloXUrlProveedor.Perfil='P';
    this.moduloXUrlFactor.Perfil='F';
    arrayUiModuloUrl.push(this.moduloXUrlComprador);
    arrayUiModuloUrl.push(this.moduloXUrlProveedor);
    arrayUiModuloUrl.push(this.moduloXUrlFactor);
    this.uiModuloUrlBoton.ListaModuloXUrl = arrayUiModuloUrl;

    let arrayUiModuloBoton:ModuloXBoton[] = [];
    
    this.botonesSeleccionadosComprador.forEach(element => {
      let moduloXBoton:ModuloXBoton = new ModuloXBoton();
      moduloXBoton.Perfil = 'C';
      if (this.id != "nuevo") {
        moduloXBoton.IdModulo = this.id;
      }
      moduloXBoton.IdBoton = element.IdBoton;
      arrayUiModuloBoton.push(moduloXBoton);
    });
    this.botonesSeleccionadosProveedor.forEach(element => {
      let moduloXBoton:ModuloXBoton = new ModuloXBoton();
      moduloXBoton.Perfil = 'P';
      if (this.id != "nuevo") {
        moduloXBoton.IdModulo = this.id;
      }
      moduloXBoton.IdBoton = element.IdBoton;
      arrayUiModuloBoton.push(moduloXBoton);
    });
    this.botonesSeleccionadosFactor.forEach(element => {
      let moduloXBoton:ModuloXBoton = new ModuloXBoton();
      moduloXBoton.Perfil = 'F';
      if (this.id != "nuevo") {
        moduloXBoton.IdModulo = this.id;
      }
      moduloXBoton.IdBoton = element.IdBoton;
      arrayUiModuloBoton.push(moduloXBoton);
    });

    if (this.botonesSeleccionadosComprador.length>0) {
      if (!/^([a-z1-9./-]{1,})$/.test(this.moduloXUrlComprador.Url)) {
        this.spinnerService.set(false);
        this.showNotify.notify('danger', "Ingrese URI de comprador válido.");
        this.habilitarForm();
        return false;
      }
    }
    if (this.botonesSeleccionadosProveedor.length>0) {
      if (!/^([a-z1-9./-]{1,})$/.test(this.moduloXUrlProveedor.Url)) {
        this.spinnerService.set(false);
        this.showNotify.notify('danger', "Ingrese URI de proveedor válido.");
        this.habilitarForm();
        return false;
      }
    }
    if (this.botonesSeleccionadosFactor.length>0) {
      if (!/^([a-z1-9./-]{1,})$/.test(this.moduloXUrlFactor.Url)) {
        this.spinnerService.set(false);
        this.showNotify.notify('danger', "Ingrese URI de factor válido.");
        this.habilitarForm();
        return false;
      }
    }

    this.uiModuloUrlBoton.ListaModuloXBoton = arrayUiModuloBoton;

    this.spinnerService.set(true);
    this.inhabilitarForm();
    if(this.modulo.CodigoModulo.length < 1){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese código del módulo.");
      this.habilitarForm();
      return false;
    }
    if(this.modulo.Mini.length < 1){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese nombre de abreviado del módulo.");
      this.habilitarForm();
      return false;
    }
    if(this.modulo.Mini !== this.modulo.Mini.toUpperCase()){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese nombre de abreviado en mayusculas.");
      this.habilitarForm();
      return false;
    }
    if(this.modulo.Descripcion.length < 1){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese nombre de módulo.");
      this.habilitarForm();
      return false;
    }
    if(this.modulo.Orden < 0 || this.modulo.Orden > 999){
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Número de orden es inválido.");
      this.habilitarForm();
      return false;
    }
    if (this.id != "nuevo") {
      this.modulo.IdModulo = this.id;
      this.uiModuloUrlBotonService.editarUiModuloUrlBoton(this.uiModuloUrlBoton).subscribe(
        response  => {
          this.handleMessage(response);
        },
        error =>  console.log(<any>error));
    }else{
      this.uiModuloUrlBotonService.crearUiModuloUrlBoton(this.uiModuloUrlBoton).subscribe(
        response  => {
          this.handleMessage(response);
        },
        error =>  console.log(<any>error));
    }
    
  }

  inhabilitarForm(){    
    //$('#formulario').find('input, textarea, button, select, a').attr('disabled','disabled');
    this.guardar = false;
  }

  habilitarForm(){    
    //$('#formulario').find('input, textarea, button, select, a').removeAttr('disabled');
    this.guardar = true;
  }

  /**
   * Boton
   */


  handleMessage(response)
  {
    if (response.status == 202) {      
      this.spinnerService.set(false);
      this.habilitarForm();
    }else{
      console.log(response);
    }
	}
  activarEditar(){
    this.guardar = true;
  }
}
