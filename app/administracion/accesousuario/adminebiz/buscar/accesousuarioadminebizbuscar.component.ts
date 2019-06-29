import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { NgForm } from '@angular/forms';
//Model
import { UsuarioXOrganizacion } from 'app/@model/administracion/UsuarioXOrganizacion';
//Service
import { UsuarioXOrganizacionService } from 'app/@service/usuarioxorganizacion.service';
//Constantes
import { MOSTRAR_RESULTADOS, PAGINA_INICIAL, MOSTRAR } from "app/utils/app.constants";

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'accesousuarioadminebizbuscar-cmp',
  templateUrl: './accesousuarioadminebizbuscar.component.html',
  providers: [
    MasterService,
    UsuarioXOrganizacionService
  ]
})

export class AccesoUsuarioAdminEbizBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  usuarioXOrganizacion: UsuarioXOrganizacion;
  usuariosXOrganizaciones:any = [];
  loading = false;
  filtro_nombre:string;
  filtro_valor:string;
  filtro_tipo:string;
  ordenar:string;
  ordenarCount:number = 0;
  /* Datos de tabla */
  paginas:any = [];
  paginaSeleccionada:any = PAGINA_INICIAL;
  mostrarResultados:any = MOSTRAR_RESULTADOS;
  mostrar:number = MOSTRAR;
  registros:number;
  arraySearchParams:any = [];
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private masterService: MasterService,
    private usuarioXOrganizacionService: UsuarioXOrganizacionService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.usuarioXOrganizacion = new UsuarioXOrganizacion();
  }
  
  ngOnInit() {
    this.listarUsuarioXOrganizacion(this.paginaSeleccionada, this.mostrar);
  }

  ngAfterViewInit() {

  }

  listarUsuarioXOrganizacion(pagina, mostrar){
    let arrayParams:any = [];
    arrayParams.push({'param': 'pagina', 'value': pagina});
    arrayParams.push({'param': 'mostrar', 'value': mostrar});
    arrayParams.push({'param': 'cabecera', 'value': 'IdUsuarioXOrganizacion,IdOrganizacion,IdUsuario,Usuario,NombreCompleto,Rol,RazonSocial,Ruc'});

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
    this.usuarioXOrganizacionService.obtenerListaUsuarioXOrganizacion(arrayParams).subscribe(
      res => {
        this.loading = true;
        this.usuariosXOrganizaciones = res.data;
        this.getPaginas(res.rows);
      }
    );
  }

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
    this.listarUsuarioXOrganizacion(seleccion, this.mostrar);
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

  buscarUsuarioXOrganizacion(uxo: NgForm){    
    this.loading = false;
    this.arraySearchParams = [];
    let arrayFiltroNombre = [];
    let arrayFiltroValor = [];
    let arrayFiltroTipo = [];
    if (uxo.value.Ruc != '') {
      arrayFiltroNombre.push('Ruc');
      arrayFiltroValor.push(uxo.value.Ruc.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (uxo.value.RazonSocial != '') {
      arrayFiltroNombre.push('RazonSocial');
      arrayFiltroValor.push(uxo.value.RazonSocial.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (uxo.value.Usuario != '') {
      arrayFiltroNombre.push('Usuario');
      arrayFiltroValor.push(uxo.value.Usuario.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (uxo.value.NombreCompleto != '') {
      arrayFiltroNombre.push('NombreCompleto');
      arrayFiltroValor.push(uxo.value.NombreCompleto.replace(/,/g,""));
      arrayFiltroTipo.push('l');
    }
    if (uxo.value.Email != '') {
      arrayFiltroNombre.push('Email');
      arrayFiltroValor.push(uxo.value.Email.replace(/,/g,""));
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

  reset(uxo: NgForm){    
    uxo.resetForm({
      Ruc: '',
      RazonSocial: '',
      Usuario: '',
      NombreCompleto: '',
      Email: ''
   });
  };
}