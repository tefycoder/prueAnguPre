import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import {URL_BUSCAR_QT} from 'app/utils/app.constants';
/*estoy añadiendo esto*/ 
import { Boton } from 'app/model/menu';
import {ChangeDetectorRef} from '@angular/core';
import { LoginService } from '../../../service/login.service';
/*import { Location } from '@angular/common';*/
/*------*/
import {CotizacionBuscar,CotizacionFiltro} from '../../../model/sm-cotizacion';
import { ComboItem } from "app/model/comboitem";

/***** */
//declare var DatatableFunctions, swal:any;
//declare var DataHardCode: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare var $, swal, DatatableFunctions, moment: any;
declare var $:any;
declare var DatatableFunctions, swal: any, moment:any;
var oCotizacionCompradorBuscarComponent:CotizacionCompradorBuscarComponent;
var datatable;

@Component({

  moduleId: module.id,
  selector: 'cotizacioncompradorbuscar-cmp',
  templateUrl: './cotizacioncompradorbuscar.component.html',
  providers: [MasterService]
})
export class CotizacionCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public dtResultados: DataTable;
  public listEstadoCombo:ComboItem[];
  public resultados: any[];//CotizacionBuscar[];
  public filtro:CotizacionFiltro;
  /*estoy añadiendo esto*/
  location: Location;
  public  url_main_module_page = '/sm-cotizacion/comprador/buscar';
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  /*----------*/
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor( private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _securityService: LoginService, private cdRef:ChangeDetectorRef) {
    /**------------ */
    //this.location = location;
    this.util = new AppUtils(this.router, this._masterService);
    //this.botonBuscar = new Boton ();
    //this.botonDetalle = new Boton ();
  }


  
validarFiltros(){

  oCotizacionCompradorBuscarComponent.filtro.nsolicitud=oCotizacionCompradorBuscarComponent.filtro.nsolicitud.trim()
  oCotizacionCompradorBuscarComponent.filtro. nseguimiento=oCotizacionCompradorBuscarComponent.filtro. nseguimiento.trim()
     
  if (this.filtro.nsolicitud == "") {
        
    if (this.filtro.fechainicio == null || this.filtro.fechainicio.toString() == "") {
          swal({
            text: "Fecha de Aceptación inicio es un campo requerido.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });
          return false;
        }
        if (this.filtro.fechafin == null || this.filtro.fechafin.toString() == "") {
          swal({
            text: "Fecha de Aceptación fin es un campo requerido.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });
          return false;
  
        }
        /*
        if (this.filtro.fechainicio!= null && this.filtro.fechainicio.toString() != "" && this.filtro.fechafin != null && this.filtro.fechafin.toString() != "") {
          let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oCotizacionCompradorBuscarComponent.filtro.fechainicio);
          let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oCotizacionCompradorBuscarComponent.filtro.fechafin);
  
  
  
          if (moment(fechaemisionfin).diff(fechaemisioninicio, 'days') > 30) {
  
            swal({
              text: 'El filtro de búsqueda "Fecha de Aceptación" debe tener un rango máximo de 30 días entre la Fecha Inicial y la Fecha Fin.',
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });
  
            return false;
          }
  
          let fechaemisioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
          let fechaemisionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);
  
          if (fechaemisioninicio_str > fechaemisionfin_str) {
            swal({
              text: "El rango de Fechas de Aceptación seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning"
            });
  
            return false;
          }
        }
        */
      }
      return true;

}

clicked(event) {
  if (this.validarFiltros())
    datatable.ajax.reload();

    event.preventDefault();
}

limpiar(event) {

  this.filtroDefecto();
  setTimeout(function () {
    $("input").each(function () {

      if (!$(this).val() && $(this).val() == '')
        $(this.parentElement).addClass("is-empty");
    });


  }, 200);


  event.preventDefault();
}


filtroDefecto() {
  let fechacreacioni = new Date();
  fechacreacioni.setDate(fechacreacioni.getDate() - 30);
  
  this.filtro = {
    nsolicitud: '',
    nseguimiento:'',
    estado:'',
    fechainicio:fechacreacioni,
    fechafin:new Date(),
  }
}

ngOnInit() {
  
      oCotizacionCompradorBuscarComponent = this;
      //PARA COLOCAR EL TIPO DE ESTADO TEGP QUE BUSCAR
      this.util.listEstadoHAS(function (data: ComboItem[]) {
        oCotizacionCompradorBuscarComponent.listEstadoCombo = data;
      });
      this.filtroDefecto();
  
    
    }
  
    ngAfterViewInit() {
      var RFQ = localStorage.getItem("NroRFQ");
       oCotizacionCompradorBuscarComponent.filtro.nsolicitud = RFQ;
       localStorage.removeItem('NroRFQ');
    
      cargarDataTable();
  
    }
  
  
  }
  
  function filtrarResultados(item) {
    //
  
    /*if (oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde) {
  
      return item.nroretenciones.indexOf(oDetraccionCompradorBuscarComponent.filtro.NumDetraccionesDesde) >= 0;
    }
    else return true;*/
  }
  
  function cargarDataTable() {

    datatable = $('#dtResultados').DataTable({
      order: [[1, "asc"]],
      searching: false,
      serverSide: true,
      
      ajax: {
  
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
          request.setRequestHeader("origen_datos", 'PEB2M');
          request.setRequestHeader("tipo_empresa", 'c');
          request.setRequestHeader("org_id", localStorage.getItem('org_id'));
          request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        },
        url: URL_BUSCAR_QT,
        dataSrc: "data",
        data: function (d) {
  
  
          //alert(oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde);
          if (oCotizacionCompradorBuscarComponent.filtro.nsolicitud != "") {
            d.nsolicitud = oCotizacionCompradorBuscarComponent.filtro.nsolicitud;
          }
  
          if (oCotizacionCompradorBuscarComponent.filtro. nseguimiento!= "") {
            d. nseguimiento = oCotizacionCompradorBuscarComponent.filtro. nseguimiento;
          }
        
  
          if (oCotizacionCompradorBuscarComponent.filtro.estado != "NONE") {
            d.Estado = oCotizacionCompradorBuscarComponent.filtro.estado;
          }
  
        
  
          if (oCotizacionCompradorBuscarComponent.filtro.fechainicio) {
            let fechainicio = DatatableFunctions.ConvertStringToDatetime(oCotizacionCompradorBuscarComponent.filtro.fechainicio);
            d.fechainicio = DatatableFunctions.FormatDatetimeForMicroService(fechainicio);
          }
  
          if (oCotizacionCompradorBuscarComponent.filtro.fechafin) {
            let fechafin = DatatableFunctions.ConvertStringToDatetime(oCotizacionCompradorBuscarComponent.filtro.fechafin);
            d.fechafin = DatatableFunctions.FormatDatetimeForMicroService(fechafin);
          }
  
          //d.column_names = 'NumeroConstancia,RazonSocialComprador,RucComprador,FechaHoraPago,Moneda,TotalMontoDetraccion,Estado';
          d.columnnames = 'Idqt,Numeroseguimiento,Nombreorg,Nombre,Desestado,Fechacreacion,Version,Ordenesemitidas,ErrorSap';
        }
      },
      columns: [
          { data: 'Numeroseguimiento' ,name: 'Numeroseguimiento'},
          { data: 'Nombreorg' ,name: 'Nombreorg'},
          { data: 'Nombre',name: 'Nombre'},
          { data: 'Desestado' ,name: 'Desestado'},
          { data: 'Fechacreacion' ,name: 'Fechacreacion'}, //DocumentoMaterial
          { data: 'Version',name: 'Version' },
          { data: 'Ordenesemitidas' ,name: 'Ordenesemitidas'},
          { data: 'Idqt', name: 'Idqt'},
      ],
      columnDefs: [
          { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },
          {
              render: function (data, type, row) {
                if(row.Desestado=='Por Evaluar')
                    return `<div class="text-center">
                    <button class="btn btn-simple"  onclick='swal({ title:"Error SAP", text: "`+row.ErrorSap+`", buttonsStyling: false, confirmButtonClass: "btn btn-danger", confirmButtonColor: "#ec6c62"});'>`+row.Desestado+`</button>
                    </div>`;
                return row.Desestado
              },
              targets: 3
          },
          {
              render: function (data, type, row) {
                  let disabled = '';
                  let href = 'href="/sm-cotizacion/comprador/formulario' + row.Idqt + '"';
                  /*if (!oDetraccionCompradorBuscarComponent.botonDetalle.habilitado) {
                    disabled = 'disabled';
                    href = '';
                  }*/
        
                  return '<div class="text-center"><a '+ href +'Idqt ="' + row.Idqt+ '">' +
                    '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left"><i class="material-icons">visibility</i></button></a></div>';
              },
              targets: 7
          }
      ]
    });
  
  
    datatable.on('click', '.edit', function (event) {
      var $tr = $(this).closest('tr');
      var data = datatable.row($tr).data();
      //console.log($tr.find( "a" ).attr('nroretenciones'));
      //if (data)
      let Idqt = $tr.find("a").attr('Idqt');
      let nav = ['/sm-cotizacion/comprador/formulario', Idqt];
  
      oCotizacionCompradorBuscarComponent.navigate(nav);
      event.preventDefault();
  
    });
  }