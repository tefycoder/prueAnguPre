import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GuiaBuscar, GuiaFiltros } from 'app/model/guia';
import { LoginService } from 'app/service/login.service';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { URL_BUSCAR_GUIA, URL_BUSCAR_GUIA_BORRADOR } from 'app/utils/app.constants';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $, swal, moment: any;
var oGuiaBuscarComponent: GuiaCompradorBuscarComponent, datatable;
declare var DatatableFunctions: any;
@Component({
  moduleId: module.id,
  selector: 'guiacompradorbuscar-cmp',
  templateUrl: './guiacompradorbuscar.component.html',
  providers: [MasterService, LoginService]
})
export class GuiaCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public dtGuia: DataTable;

  public filtro: GuiaFiltros;
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  public url_main_module_page = '/sm-guia/comprador/buscar';
  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }

  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
    this.util = new AppUtils(this.router, this._masterService);
    this.botonBuscar = new Boton();
    this.botonDetalle = new Boton();
  }
  obtenerBotones() {

    let botones = this._securityService.ObtenerBotonesCache(this.url_main_module_page) as Boton[];
    if (botones) {

      this.configurarBotones(botones);
    }
    else {

      this._securityService.obtenerBotones(this.url_main_module_page).subscribe(
        botones => {

          oGuiaBuscarComponent.configurarBotones(botones);
          oGuiaBuscarComponent._securityService.guardarBotonesLocalStore(this.url_main_module_page, botones);
        },
        e => console.log(e),
        () => { });

    }

  }
  configurarBotones(botones: Boton[]) {

    if (botones && botones.length > 0) {
      this.botonBuscar = botones.find(a => a.nombre === 'buscar') ? botones.find(a => a.nombre === 'buscar') : this.botonBuscar;
      this.botonDetalle = botones.find(a => a.nombre === 'detalle') ? botones.find(a => a.nombre === 'detalle') : this.botonDetalle;

    }

  }

  validarfiltros() {

    oGuiaBuscarComponent.filtro.nroguia = oGuiaBuscarComponent.filtro.nroguia.trim();
    oGuiaBuscarComponent.filtro.nrooc = oGuiaBuscarComponent.filtro.nrooc.trim();
    oGuiaBuscarComponent.filtro.nroerp = oGuiaBuscarComponent.filtro.nroerp.trim();

    if (this.filtro.nroguia == "" && this.filtro.nrooc == "") {
      if (this.filtro.fechaemisioninicio == null || this.filtro.fechaemisioninicio.toString() == "") {
        swal({
          text: "Fecha de Emisión inicio es un campo requerido.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }
      if (this.filtro.fechaemisionfin == null || this.filtro.fechaemisionfin.toString() == "") {
        swal({
          text: "Fecha de Emisión fin es un campo requerido.",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;

      }

      if (this.filtro.fechaemisioninicio != null && this.filtro.fechaemisioninicio.toString() != "" && this.filtro.fechaemisionfin != null && this.filtro.fechaemisionfin.toString() != "") {
        let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oGuiaBuscarComponent.filtro.fechaemisioninicio);
        let fechaemisionfin = DatatableFunctions.ConvertStringToDatetime(oGuiaBuscarComponent.filtro.fechaemisionfin);



        if (moment(fechaemisionfin).diff(fechaemisioninicio, 'days') > 30) {

          swal({
            text: 'El filtro de búsqueda "Fecha de Emisión" debe tener un rango máximo de 30 días entre la Fecha Inicial y la Fecha Fin.',
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
            text: "El rango de Fechas de Emisión seleccionado no es correcto. La Fecha Inicial es mayor a la Fecha Fin.",
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-warning"
          });

          return false;
        }
      }
    }
    return true;
  }


  clicked(event) {
    if (this.validarfiltros())
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
      nroguia: '',
      nrooc: '',
      nroerp: '',
      fechaemisioninicio: fechacreacioni,
      fechaemisionfin: new Date(),
      estado: 'NONE',
      publicada: true,

    }
  }


  ngOnInit() {
    this.filtroDefecto();
    this.util.listEstadoGuia(function (data: ComboItem[]) {
      oGuiaBuscarComponent.listEstadoCombo = data;
    });
    oGuiaBuscarComponent = this;

  }

  ngAfterViewInit() {
    cargarDataTable();
    this.obtenerBotones();
  }

  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }
}

function cargarDataTable() {

  datatable = $('#dtResultados').DataTable({
    order: [[4, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {

      beforeSend: function (request) {
        if (!oGuiaBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'C');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: URL_BUSCAR_GUIA,
      dataSrc: "data",
      data: function (d) {

        if (oGuiaBuscarComponent.filtro.nroguia != "") {
          d.NumeroGuia = oGuiaBuscarComponent.filtro.nroguia.trim();
        }

        else {
          if (oGuiaBuscarComponent.filtro.nrooc != "") {
            d.NumeroOC = oGuiaBuscarComponent.filtro.nrooc.trim();
          }

          else {

            if (oGuiaBuscarComponent.filtro.nroerp != "") {
              d.DocumentoMaterial = oGuiaBuscarComponent.filtro.nroerp.trim();
            }

            if (oGuiaBuscarComponent.filtro.estado != "NONE") {
              d.Estado = oGuiaBuscarComponent.filtro.estado;
            }

            if (oGuiaBuscarComponent.filtro.fechaemisioninicio) {

              let fechaemisioninicio = DatatableFunctions.ConvertStringToDatetime(oGuiaBuscarComponent.filtro.fechaemisioninicio);
              d.FechaEmision_inicio = DatatableFunctions.FormatDatetimeForMicroService(fechaemisioninicio);
            }

            if (oGuiaBuscarComponent.filtro.fechaemisionfin) {

              let fechaemisionfin = DatatableFunctions.AddDayEndDatetime(DatatableFunctions.ConvertStringToDatetime(oGuiaBuscarComponent.filtro.fechaemisionfin));
              d.FechaEmision_fin = DatatableFunctions.FormatDatetimeForMicroService(fechaemisionfin);
            }
          }
        }
        d.column_names = '[CodigoGuia,NumeroGuia,FechaEmision,FechaInicioTraslado,FechaEstimadaArribo,RazonSocialCliente,RazonSocialProveedor,Estado,DocumentoMaterial,MotivoRechazoSAP,MotivoErrorSAP]';

      }
    },


    columns: [

      { data: 'NumeroGuia', name: 'NumeroGuia' },
      { data: 'DocumentoMaterial', name: 'DocumentoMaterial' },
      { data: 'Estado', name: 'Estado' },
      { data: 'RazonSocialProveedor', name: 'RazonSocialProveedor' },
      { data: 'FechaEmision', name: 'FechaEmision' },
      { data: 'FechaInicioTraslado', name: 'FechaInicioTraslado' },
      { data: 'FechaEstimadaArribo', name: 'FechaEstimadaArribo' },
      { data: 'NumeroGuia', name: 'NumeroGuia' },

    ],
    columnDefs: [

      { "className": "text-center", "targets": [0, 1, 2, 3, 4, 5, 6, 7] },
      {
        render: function (data, type, row) {
          if(!((typeof row.MotivoRechazoSAP === "undefined") || (row.MotivoRechazoSAP.trim().length === 0)))
              return `<div class="text-center">
              <button class="btn btn-simple" style="color:red;" onclick='swal({ title:"Documento Rechazado", text: "`+row.MotivoRechazoSAP+`", buttonsStyling: false, confirmButtonClass: "btn btn-danger", confirmButtonColor: "#ec6c62"});'>Rechazo</button>
              </div>`;

          if(!((typeof row.MotivoErrorSAP === "undefined") || (row.MotivoErrorSAP.trim().length === 0)))          
              return `<div class="text-center">
              <button class="btn btn-simple" style="color:red;" onclick='swal({ title:"Error SAP", text: "`+row.MotivoErrorSAP+`", buttonsStyling: false, confirmButtonClass: "btn btn-danger", confirmButtonColor: "#ec6c62"});'>Error</button>
              </div>`;

          return row.DocumentoMaterial             
        },
        targets: 1,
      },      
      {

        render: function (data, type, row) {
          let disabled = '';
          let href = 'href="/sm-guia/comprador/formulario/' + row.CodigoGuia + '"';
          if (!oGuiaBuscarComponent.botonDetalle.habilitado) {
            disabled = 'disabled';
            href = '';
          }
          //return data +' ('+ row[3]+')';
          return '<div class="text-center"><a ' + href + ' row-id="' + row.CodigoGuia + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver" data-placement="left" ' + disabled + '><i class="material-icons">visibility</i></button></a>' +
            '</div>';
        },
        targets: 7
      }
    ]
  });





  datatable.on('click', '.edit', function (event) {
    if (oGuiaBuscarComponent.botonDetalle.habilitado) {
      var $tr = $(this).closest('tr');


      let row_id = $tr.find("a").attr('row-id');
      let nav = ['/sm-guia/comprador/formulario', row_id];

      oGuiaBuscarComponent.navigate(nav);
    }
    event.preventDefault();

  });




}
