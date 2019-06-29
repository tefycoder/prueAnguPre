import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
//Model
import { GrupoEmpresarial } from "app/@model/administracion/GrupoEmpresarial";
//Service
import { GrupoEmpresarialService } from "app/@service/grupoempresarial.service";
import { OrganizacionService } from "app/@service/organizacion.service";
//Shape
import { SpinnerService } from 'app/service/spinner.service';
import { ShowNotify } from 'app/@components/notify.component';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'grupoempresarialadminebizformulario-cmp',
  templateUrl: './grupoempresarialadminebizformulario.component.html',
  providers: [
    GrupoEmpresarialService, 
    MasterService, 
    ShowNotify,
    OrganizacionService
  ]
})

export class GrupoEmpresarialAdminEbizFormularioComponent implements OnInit {
  title: string = "Crear grupo empresarial";
  guardar:boolean = true;
  id: string = "";
  opcionesCodigo:any = [];
  opcionesCodigoGrupoEmpresarialEnBaseDatos:any = [];
  grupoEmpresarial:GrupoEmpresarial;
  arrayParamsCodigoGrupoEmpresarial:any = [{'param': 'pagina', 'value': 0},
    {'param': 'mostrar', 'value': 9999999},
    {'param': 'cabecera', 'value': 'Codigo'},
    {'param': 'filtro_nombre', 'value': 'Estado'},
    {'param': 'filtro_valor', 'value': 'ACTIV'},
    {'param': 'filtro_tipo', 'value': 'i'}];
  loading = false;
  organizaciones:any = [];
  ordenar:string;
  ordenarCount:number = 0;
  util: AppUtils;
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }
  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private masterService: MasterService, 
    private grupoEmpresarialService: GrupoEmpresarialService,    
    private spinnerService: SpinnerService,
    private showNotify: ShowNotify,
    private organizacionService: OrganizacionService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.grupoEmpresarial = new GrupoEmpresarial();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];      
    });

    if (this.id != "nuevo") {
      this.guardar = false;
      this.title = "Editar grupo empresarial";
      this.listarOrganizacionesPorGrupoEmpresarial(this.id); 
      this.grupoEmpresarialService.obtenerGrupoEmpresarialPorId(this.id).subscribe(
        res => {
          this.grupoEmpresarial = res['data'];
        }
      );
    }
    
    this.grupoEmpresarialService.obtenerListaGrupoEmpresarial(this.arrayParamsCodigoGrupoEmpresarial).subscribe(res => {
      res.data.forEach(element => {
        this.opcionesCodigoGrupoEmpresarialEnBaseDatos.push(element.Codigo.toUpperCase());
      });
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
  }

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
    for (let index = 0; index < this.opcionesCodigoGrupoEmpresarialEnBaseDatos.length; index++) {
      let element = this.opcionesCodigoGrupoEmpresarialEnBaseDatos[index];
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

  guardarGrupoEmpresarial(e){
    this.spinnerService.set(true);
    this.inhabilitarForm();
    if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9-. ]{4,})$/.test(this.grupoEmpresarial.Descripcion)) {
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Ingrese grupo empresarial válido.");
      this.habilitarForm();
      return false;
    }
    if (this.grupoEmpresarial.Codigo != "") {      
      if (!/^([A-Za-zñÑáÁéÉíÍóÓúÚ0-9]{3,})$/.test(this.grupoEmpresarial.Codigo)) {
        this.spinnerService.set(false);
        this.showNotify.notify('danger', "Seleccione un código un de grupo empresarial válido.");
        this.habilitarForm();
        return false;
      }
    }else{
      this.spinnerService.set(false);
      this.showNotify.notify('danger', "Seleccione un código un de grupo empresarial válido.");
      this.habilitarForm();
      return false;
    }
    if (this.id != "nuevo") {
      this.grupoEmpresarial.IdGrupo = this.id;
      this.grupoEmpresarialService.editarGrupoEmpresarial(this.grupoEmpresarial).subscribe(
        response  => {
          this.handleMessage(response);
        },
        error =>  console.log(<any>error));
    }else{
      this.grupoEmpresarialService.crearGrupoEmpresarial(this.grupoEmpresarial).subscribe(
        response  => {
          this.handleMessage(response);
        },
        error =>  console.log(<any>error));
    }
    
  }

  inhabilitarForm(){    
    $('#formulario').find('input, textarea, button, select, a').attr('disabled','disabled');
  }

  habilitarForm(){    
    $('#formulario').find('input, textarea, button, select, a').removeAttr('disabled');
  }

  handleMessage(response)
  {
    if (response.status == 202) {
      setTimeout(()=>{
        this.spinnerService.set(false);     
        this.router.navigate(['grupoempresarial/adminebiz/buscar']);
      },2000);      
    }else{
      console.log(response);
    }
  }
  
  cambiarResultadosMostrar(){
    this.loading = false;
    this.listarOrganizacionesPorGrupoEmpresarial(this.id);
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
  
  listarOrganizacionesPorGrupoEmpresarial(idGrupo){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': 0});
    arrayParams.push({'param': 'mostrar', 'value': 999999});
    arrayParams.push({'param': 'cabecera', 'value': 'IdOrganizacion,Nombre,Ruc,Estado'});
    arrayParams.push({'param': 'filtro_nombre', 'value': 'IdGrupo'});
    arrayParams.push({'param': 'filtro_valor', 'value': idGrupo});
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
    this.organizacionService.obtenerListaOrganizacion(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.organizaciones = res.data;
      }
    );
  }

  activarEditar(){
    this.guardar = true;
  }
}
