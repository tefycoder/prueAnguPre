import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
//Model
import { UsuarioXOrganizacion } from 'app/@model/administracion/UsuarioXOrganizacion';
import { OrganizacionXUsuarioXModulo } from "app/@model/administracion/OrganizacionXUsuarioXModulo";
import { OrganizacionXUsuarioXModuloXBoton } from "app/@model/administracion/OrganizacionXUsuarioXModuloXBoton";
import { UiOrganizacionUsuarioModuloBoton } from "app/@model/administracion/ui/UiOrganizacionUsuarioModuloBoton";
//Service
import { UsuarioXOrganizacionService } from 'app/@service/usuarioxorganizacion.service';
import { OrganizacionXUsuarioXModuloService } from "app/@service/organizacionxusuarioxmodulo.service";
import { OrganizacionXUsuarioXModuloXBotonService } from "app/@service/organizacionxusuarioxmoduloxboton.service";
import { UiOrganizacionXUsuarioXModuloXBotonService } from "app/@service/uiorganizacionxusuarioxmoduloxboton.service";
//Shape
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from 'app/@components/notify.component';

declare var $: any;
var oAsignarModulosCompradorFormularioComponent;
@Component({
  moduleId: module.id,
  selector: 'accesousuarioadminebizformulario-cmp',
  templateUrl: './accesousuarioadminebizformulario.component.html',
  providers: [
    MasterService,
    UsuarioXOrganizacionService,
    UiOrganizacionXUsuarioXModuloXBotonService,
    OrganizacionXUsuarioXModuloService,
    OrganizacionXUsuarioXModuloXBotonService,
    ShowNotify
  ]
})

export class AccesoUsuarioAdminEbizFormularioComponent implements OnInit, AfterViewInit {
  mostrarCard:boolean = false;
  title:string = "Permisos de usuario";
  id:string;
  util: AppUtils;
  default:string = '';
  usuarioXOrganizacion:UsuarioXOrganizacion
  contratosDetalle:any = [];
  tabSelecionado:string;
  seleccionBotones:any = [];
  moduloBotonesDisponibles:any = [];
  uiOrganizacionUsuarioModuloBoton:UiOrganizacionUsuarioModuloBoton;
  

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private masterService: MasterService, 
    private usuarioXOrganizacionService: UsuarioXOrganizacionService,
    private uiOrganizacionXUsuarioXModuloXBotonService: UiOrganizacionXUsuarioXModuloXBotonService,
    private organizacionXUsuarioXModuloService: OrganizacionXUsuarioXModuloService,
    private organizacionXUsuarioXModuloXBotonService: OrganizacionXUsuarioXModuloXBotonService,
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.usuarioXOrganizacion = new UsuarioXOrganizacion();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id != '') {
        this.usuarioXOrganizacionService.obtenerUsuarioXOrganizacionPorId(this.id).subscribe(
          res => {
            this.usuarioXOrganizacion = res['data'];
            this.mostrarCard = true;       
          }
        );

      }else{
        this.router.navigate(['accesousuario/adminebiz/buscar']);
      }
    });
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

  seleccionarDefault(IdModulo){
    this.default = IdModulo;
    $('#'+IdModulo).not(this).prop('checked', true);
  }

  guardarOrganizacionUsuarioModuloBoton(){
    this.spinnerService.set(true);
    this.uiOrganizacionUsuarioModuloBoton = new UiOrganizacionUsuarioModuloBoton();
    let arrayModulos = [];
    let arrayModulosBotones = [];
    let organizacionXUsuarioXModuloSeleccionados:OrganizacionXUsuarioXModulo [] = [];
    let organizacionXUsuarioXModuloXBotonSeleccionados:OrganizacionXUsuarioXModuloXBoton [] = [];
    let checkbox_checkbox = $('.modulo input:checkbox').find(':checked');
    checkbox_checkbox = checkbox_checkbox.prevObject;
    for (let index = 0; index < checkbox_checkbox.length; index++) {
      let element = checkbox_checkbox[index];
      if (element.checked) {
        //arrayModulos.push(element.value);
        //Inicio OrganizacioUsuarioModulo
        let organizacionXUsuarioXModulo:OrganizacionXUsuarioXModulo = new OrganizacionXUsuarioXModulo();
        if (this.default == '') {          
          if (index == 0) {
            organizacionXUsuarioXModulo.Default = 1;
          }
        }else{
          if (element.value == this.default) {
            organizacionXUsuarioXModulo.Default = 1;
          }
        }
        organizacionXUsuarioXModulo.IdModulo = element.value;
        organizacionXUsuarioXModulo.IdOrganizacion = this.usuarioXOrganizacion.IdOrganizacion;
        organizacionXUsuarioXModulo.IdUsuario = this.usuarioXOrganizacion.IdUsuario;
        organizacionXUsuarioXModuloSeleccionados.push(organizacionXUsuarioXModulo);
        //Fin OrganizacioUsuarioModulo
        

          //Inicio
          let checkbox_checkbox_sub = $('.' + element.value + ' input:checkbox').find(':checked');
          checkbox_checkbox_sub = checkbox_checkbox_sub.prevObject;
          for (let index = 0; index < checkbox_checkbox_sub.length; index++) {
            let element_sub = checkbox_checkbox_sub[index];
            if (element_sub.checked) {
              //arrayModulosBotones.push(element_sub.value);
              //Inicio OrganizacionUsuarioModuloBoton
              let organizacionXUsuarioXModuloXBoton:OrganizacionXUsuarioXModuloXBoton = new OrganizacionXUsuarioXModuloXBoton();
              organizacionXUsuarioXModuloXBoton.IdBoton = element_sub.value;
              organizacionXUsuarioXModuloXBoton.IdModulo = element.value;
              organizacionXUsuarioXModuloXBoton.IdOrganizacion = this.usuarioXOrganizacion.IdOrganizacion;
              organizacionXUsuarioXModuloXBoton.IdUsuario = this.usuarioXOrganizacion.IdUsuario;
              organizacionXUsuarioXModuloXBotonSeleccionados.push(organizacionXUsuarioXModuloXBoton);
              //Inicio OrganizacionUsuarioModuloBoton
            }
          }
          //Fin
      }
    }

    if (organizacionXUsuarioXModuloSeleccionados.length >= 0  || organizacionXUsuarioXModuloXBotonSeleccionados.length >= 0) {
      this.uiOrganizacionUsuarioModuloBoton.ListaOrganizacionUsuarioModulo = organizacionXUsuarioXModuloSeleccionados;
      this.uiOrganizacionUsuarioModuloBoton.ListaOrganizacionUsuarioModuloBoton = organizacionXUsuarioXModuloXBotonSeleccionados;
      this.uiOrganizacionXUsuarioXModuloXBotonService.crearUiOrganizacionXUsuarioXModuloXBoton(this.uiOrganizacionUsuarioModuloBoton).subscribe(
        res => {
          if (res.status == 202) {
            this.spinnerService.set(false);
          }else{
            this.showNotify.notify('danger', "No se pudo guardar.");
          }
        }
      );
    }else{
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Debe de selecicionar al menos un módulo.");
    }
  }

  seleccionBoton(IdModulo:string){
    $('#'+IdModulo).not(this).prop('checked', true);
  }
 
  cargarContratosDetalle(TipoEmpresa){    
    if ($('#'+TipoEmpresa).prop('checked') == true) {
      $('#perfiles input:checkbox').not(this).prop('checked', false);
      $('#'+TipoEmpresa).prop('checked', true)
      this.obtenerModulosBotonesXContratoDetalle(TipoEmpresa);
    }
   /* if ($('input::checkbox').prop('checked', false)) {
      
    }
    $('#C').prop('checked', false);
    $('#F').prop('checked', false);
    $('#P').prop('checked', false);
    console.log("TipoEmpresa : " + TipoEmpresa + " - " + $('#'+TipoEmpresa).prop('checked'));*/
  }
  

  obtenerModulosBotonesXContratoDetalle(TipoEmpresa:string){
    //Consultar los botones disponibles por contrato
    let arrayParamsModuloXBoton = [
      {'param': 'id', 'value': this.usuarioXOrganizacion.IdOrganizacion},
      {'param': 'perfil', 'value': TipoEmpresa}
    ];
    this.uiOrganizacionXUsuarioXModuloXBotonService.obtenerListaUiModuloXBoton(arrayParamsModuloXBoton).subscribe(res=>{          
      this.moduloBotonesDisponibles = res.data;
      /////////////////////////obtenerListaOrganizacionXUsuarioXModuloXBoton//////////////////////////////
      let arrayParamsOrganizacionXUsuarioXModuloXBoton = [
        {'param': 'idorganizacion', 'value': this.usuarioXOrganizacion.IdOrganizacion},
        {'param': 'idusuario', 'value': this.usuarioXOrganizacion.IdUsuario}
      ];
      this.uiOrganizacionXUsuarioXModuloXBotonService.obtenerListaOrganizacionXUsuarioXModuloXBoton(arrayParamsOrganizacionXUsuarioXModuloXBoton).subscribe(res=>{          
        
        let oumb:any = res.data.ListaOrganizacionXUsuarioXModuloXBoton;
        oumb.forEach(modulo => {
          if (modulo.Default == 1) {
            this.seleccionarDefault(modulo.IdModulo);
          }
          $('#'+modulo.IdModulo).not(this).prop('checked', true);
          modulo.ListaOrganizacionXUsuarioXModuloXBoton.forEach(boton => {
            $('#'+modulo.IdModulo+boton.IdBoton).not(this).prop('checked', true);
          });
        });
      });
      /////////////////////////END obtenerListaOrganizacionXUsuarioXModuloXBoton//////////////////////////////
    });
  }
}
