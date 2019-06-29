import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import {URL_BUSCAR_QT,URL_BUSCAR_QT_BORRADOR} from 'app/utils/app.constants';
/*estoy añadiendo esto*/ 
import { Boton } from 'app/model/menu';
import {ChangeDetectorRef} from '@angular/core';
import { LoginService } from '../../../service/login.service';
/*import { Location } from '@angular/common';*/
/*------*/
import {CotizacionBuscar,CotizacionFiltro} from '../../../model/sm-cotizacion';
import { ComboItem } from "app/model/comboitem";
import { CotizacionService } from 'app/service/sm-cotizacionservice';

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
var oCotizacionProveedorBuscarComponent:CotizacionProveedorBuscarComponent;
var datatable;

@Component({

  moduleId: module.id,
  selector: 'cotizacionproveedorbuscar-cmp',
  templateUrl: './cotizacionproveedorbuscar.component.html',
  providers: [MasterService, CotizacionService]
})

export class CotizacionProveedorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public dtResultados: DataTable;
  public listEstadoCombo:ComboItem[];
  public resultados: CotizacionBuscar[];
  public filtro:CotizacionFiltro;
  /*estoy añadiendo esto*/
  location: Location;
  public  url_main_module_page = '/sm-cotizacion/proveedor/buscar';
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
    //this.filtro.publicada= true;
    //this.botonBuscar = new Boton ();
    //this.botonDetalle = new Boton ();
  }

  
  
validarFiltros(){

  oCotizacionProveedorBuscarComponent.filtro.nsolicitud=oCotizacionProveedorBuscarComponent.filtro.nsolicitud.trim()
  oCotizacionProveedorBuscarComponent.filtro. nseguimiento=oCotizacionProveedorBuscarComponent.filtro. nseguimiento.trim()
     
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
  
        if (this.filtro.fechainicio!= null && this.filtro.fechainicio.toString() != "" && this.filtro.fechafin != null && this.filtro.fechafin.toString() != "") {
          let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oCotizacionProveedorBuscarComponent.filtro.fechainicio);
          let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oCotizacionProveedorBuscarComponent.filtro.fechafin);
  
  
  
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

          if (this.filtro.fechainicio != null && this.filtro.fechainicio.toString() != "" && this.filtro.fechafin != null && this.filtro.fechafin.toString() != "") {
            let fechacreacioninicio = DatatableFunctions.ConvertStringToDatetime( oCotizacionProveedorBuscarComponent.filtro.fechainicio);
            let fechacreacionfin = DatatableFunctions.ConvertStringToDatetime( oCotizacionProveedorBuscarComponent.filtro.fechafin);
            let fechacreacioninicio_str = DatatableFunctions.FormatDatetimeForMicroService(fechacreacioninicio);
            let fechacreacionfin_str = DatatableFunctions.FormatDatetimeForMicroService(fechacreacionfin);
        
            if (fechacreacioninicio_str > fechacreacionfin_str) {
              swal({
                text: "El rango de Fechas de creación seleccionado no es correcto.",
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning"
              });
        
              return false;
            }
          }
        
          return true; 
        }
      }
      return true;

}
async  DescartarBorradores(event) {
  event.preventDefault();
  let checkboxGuias = $('#dtResultados').find('.checkboxCP:checked');
  if (checkboxGuias.length <= 0) {
    swal({
      text: "Debe seleccionar un comprobante de pago.",
      type: 'warning',
      buttonsStyling: false,
      confirmButtonClass: "btn btn-warning"
    });
    return false;
  }

  swal({
    html: '¿Está seguro de descartar los comprobantes de pagos seleccionados?',
    type: "warning",
    //html: true,
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    buttonsStyling: false,
    confirmButtonClass: "btn btn-default",
    cancelButtonClass: "btn btn-warning",
  }).then(
    function () {


      oCotizacionProveedorBuscarComponent;



      setTimeout(function () {

        datatable.ajax.reload();
        swal({
          text: "Se descartó los comprobantes de pagos seleccionados.",
          type: 'success',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-success"
        });

      }, 1000);
    },
    function (dismiss) {
    })
}

clicked(event) {
  if (this.validarFiltros()) {

    if (this.filtro.publicada)
      datatable.ajax.url(URL_BUSCAR_QT).load();
    else
      datatable.ajax.url(URL_BUSCAR_QT_BORRADOR).load();
  }

  if(event)
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
    nsolicitud:'',
    nseguimiento:'',
    estado:'',
    fechainicio:fechacreacioni,
    fechafin:new Date(),
    publicada: true,
  }
}

ngOnInit() {
  
      oCotizacionProveedorBuscarComponent = this;
      this.filtroDefecto();
      //PARA COLOCAR EL TIPO DE ESTADO TEGP QUE BUSCAR
      this.util.listEstadoHAS(function (data: ComboItem[]) {
        oCotizacionProveedorBuscarComponent.listEstadoCombo = data;
      });
      
  
    
    }
  
    ngAfterViewInit() {
  

      cargarDataTable();
  
    }
    ngAfterViewChecked() {

      this.cdRef.detectChanges();
    }
  
  
  }
  
  function cargarDataTable() {

    let url = URL_BUSCAR_QT_BORRADOR;
    if (oCotizacionProveedorBuscarComponent.filtro.publicada)
      url = URL_BUSCAR_QT;
    datatable = $('#dtResultados').on('init.dt', function (e, settings, json) {
      DatatableFunctions.initDatatable(e, settings, json, datatable);
    }).DataTable({
      order: [[1, "asc"]],
      searching: false,
      serverSide: true,
      
      ajax: {
  
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
            request.setRequestHeader("origen_datos", 'PEB2M');
            request.setRequestHeader("tipo_empresa", 'p');
            request.setRequestHeader("org_id", localStorage.getItem('org_id'));
            request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
        },
        url: url,
        dataSrc: "data",
        data: function (d) {
            //alert(oDetraccionCompradorBuscarComponent.filtro.nrodetracciondesde);
            if (oCotizacionProveedorBuscarComponent.filtro.nsolicitud != "") {
              d.nsolicitud = oCotizacionProveedorBuscarComponent.filtro.nsolicitud;
            }
    
            if (oCotizacionProveedorBuscarComponent.filtro. nseguimiento!= "") {
              d. nseguimiento = oCotizacionProveedorBuscarComponent.filtro. nseguimiento;
            }

            if (oCotizacionProveedorBuscarComponent.filtro.estado != "NONE") {
              d.Estado = oCotizacionProveedorBuscarComponent.filtro.estado;
            }

            if (oCotizacionProveedorBuscarComponent.filtro.fechainicio) {
              let fechainicio = DatatableFunctions.ConvertStringToDatetime(oCotizacionProveedorBuscarComponent.filtro.fechainicio);
              d.fechainicio = DatatableFunctions.FormatDatetimeForMicroService(fechainicio);
            }
    
            if (oCotizacionProveedorBuscarComponent.filtro.fechafin) {
              let fechafin = DatatableFunctions.ConvertStringToDatetime(oCotizacionProveedorBuscarComponent.filtro.fechafin);
              d.fechafin = DatatableFunctions.FormatDatetimeForMicroService(fechafin);
            }
    
            //d.column_names = 'NumeroConstancia,RazonSocialComprador,RucComprador,FechaHoraPago,Moneda,TotalMontoDetraccion,Estado';
            d.columnnames = 'Idqt,Numeroseguimiento,Nombreorg,Nombre,Desestado,Fechacreacion,Version,Ordenesemitidas,ErrorSap';
            if(!oCotizacionProveedorBuscarComponent.filtro.publicada)
            d.columnnames = '[Numeroseguimiento,Nombreorg,Nombre,Ordenesemitidas,Desestado,Version,Fechacreacion]';
        }
      },
      columns: [
          { data: 'Numeroseguimiento' ,name: 'Numeroseguimiento'},
          { data: 'Nombreorg' ,name: 'Nombreorg'},
          { data: 'Nombre',name: 'Nombre'},
          { data: 'Desestado' ,name: 'Desestado'},
          { data: 'Version',name: 'Version' },
          { data: 'Fechacreacion' ,name: 'Fechacreacion'}, //DocumentoMaterial
          { data: 'Ordenesemitidas' ,name: 'Ordenesemitidas'},
          { data: 'Idqt', name: 'Idqt'},

      ],
      columnDefs: [
        { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },
        {
            render: function (data, type, row) {
              if(row.Desestado=='Emitida')          
                  return `<div class="text-center">
                  <button class="btn btn-simple"  onclick='swal({ title:"Error SAP", text: "`+row.ErrorSap+`", buttonsStyling: false, confirmButtonClass: "btn btn-danger", confirmButtonColor: "#ec6c62"});'>`+row.Desestado+`</button>
                  </div>`;
              return row.Desestado              
            },
            targets: 3
        },       
        {
            render: function (data, type, row) {
              let esBorrador = oCotizacionProveedorBuscarComponent.filtro.publicada ? '0' : '1';

              let title = "Ver/Editar";
              if (oCotizacionProveedorBuscarComponent.filtro.publicada)
                title = "Ver";
              //return data +' ('+ row[3]+')';
              return '<div class="text-center edit"><a class= "editar" href="/sm-cotizacion/proveedor/formulario/' + row.Idqt + '" Idqt="' + row.Idqt + '" esBorrador="' + esBorrador + '" id_doc="' + row.id_doc + '">' +
                '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="' + title + '" data-placement="left"><i class="material-icons">visibility</i></button></a>' +
                '</div>';
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
      let row_id = $tr.find("a.editar").attr('Idqt');
      console.log('aquiiiiiiii')
      console.log(row_id)
      // let otros = $tr.find("a.editar").attr('otros');
      // alert(otros)
      let esBorrador = $tr.find("a.editar").attr('esBorrador');
      let id_doc = $tr.find("a").attr('id_doc');

      let nav = ['/sm-cotizacion/proveedor/formulario', row_id, {b: esBorrador, c:id_doc}];
  
      oCotizacionProveedorBuscarComponent.navigate(nav);
      event.preventDefault();
    });
  }