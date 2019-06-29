import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
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

@Component({
  moduleId: module.id,
  selector: 'grupoempresarialadminebizdetalle-cmp',
  templateUrl: './grupoempresarialadminebizdetalle.component.html',
  providers: [
    GrupoEmpresarialService,
    MasterService, 
    OrganizacionService, 
    SpinnerService
  ]
})

export class GrupoEmpresarialAdminEbizDetalleComponent implements OnInit {
  id: string = "";
  loading = false;
  organizaciones:any = [];
  messages:any = [];
  util: AppUtils;
  opcionesCodigo:any = [];
  opcionesCodigoGrupoEmpresarialEnBaseDatos:any = [];
  arrayParamsOrganizacionPorGrupoEmpresarial:any [];
  ordenar:string;
  ordenarCount:number = 0;
  grupoEmpresarial:GrupoEmpresarial;
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }
  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private masterService: MasterService, 
    private grupoEmpresarialService: GrupoEmpresarialService,
    private organizacionService: OrganizacionService,
    private spinnerService: SpinnerService
  ) {
    this.util = new AppUtils(this.router, this.masterService);
    this.grupoEmpresarial = new GrupoEmpresarial();    
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.grupoEmpresarialService.obtenerGrupoEmpresarialPorId(this.id).subscribe(
        res => {
          this.grupoEmpresarial = res['data'];     
          this.listarOrganizacionesPorGrupoEmpresarial(this.id);    
        }
      ); 
    });    
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
}
