import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GuiaBuscar, GuiaFiltros } from '../../../model/guia';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { GuiaService } from '../../../service/guiaservice';

import { ComboItem } from "app/model/comboitem";
import { URL_BUSCAR_GUIA, URL_BUSCAR_GUIA_BORRADOR } from 'app/utils/app.constants';

import { LoginService } from '../../../service/login.service';
import { Boton } from 'app/model/menu';
import { ChangeDetectorRef } from '@angular/core';

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $, swal, moment: any;
declare var DatatableFunctions: any;
var oGuiaBuscarComponent: GuiaProveedorBuscarComponent, datatable;
@Component({
  moduleId: module.id,
  selector: 'guiaproveedorbuscar-cmp',
  templateUrl: 'guiaproveedorbuscar.component.html',
  providers: [GuiaService, MasterService, LoginService]
})
export class GuiaProveedorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public dtGuia: DataTable;
  public resultados: GuiaBuscar[];
  public filtro: GuiaFiltros;
  
  public url_main_module_page = '/sm-guia/proveedor/buscar';
  public botonBuscar: Boton = new Boton();
  public botonDetalle: Boton = new Boton();
  public botonDescartar: Boton = new Boton();
  public botonRegistrar: Boton = new Boton();

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }

  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService, private guiaService: GuiaService, private _securityService: LoginService, private cdRef: ChangeDetectorRef) {
    this.util = new AppUtils(this.router, this._masterService);
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
      this.botonDescartar = botones.find(a => a.nombre === 'descartarborrador') ? botones.find(a => a.nombre === 'descartarborrador') : this.botonDescartar;
      this.botonRegistrar = botones.find(a => a.nombre === 'registrarguia') ? botones.find(a => a.nombre === 'registrarguia') : this.botonRegistrar;

    }

  }
  validarfiltros() {

    this.filtro.nroguia = this.filtro.nroguia.trim();
    this.filtro.nrooc = this.filtro.nrooc.trim();
    this.filtro.nroerp = this.filtro.nroerp.trim();



    let regex = /^[0-9]*$/;
      if (!regex.test(this.filtro.nroerp) || !regex.test(this.filtro.nrooc)) {
        swal({
          html: " <p class= text-center> Solo se aceptan caracteres de tipo numérico </p>",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }

      /*if (this.filtro.nroguia == " " && this.filtro.nrooc== "") {
        swal({
          text: "Se requiere al menos el numero de Guía o de Orden de Compra",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: "btn btn-warning"
        });
        return false;
      }*/
      
      /*
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
    }*/

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
    return true;
  }
  clicked(event) {
    if (this.validarfiltros()) {

      if (this.filtro.publicada)

        datatable.ajax.url(URL_BUSCAR_GUIA).load();
      else
        datatable.ajax.url(URL_BUSCAR_GUIA_BORRADOR).load();
    }

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
    this.util.listEstadoGuia(function (data: ComboItem[]) {
      data = data.filter(a => a.valor != 'GBORR');
      oGuiaBuscarComponent.listEstadoCombo = data;
    });
    oGuiaBuscarComponent = this;
    this.filtroDefecto();

  }

  ngAfterViewInit() {
    cargarDataTable();
    DatatableFunctions.registerCheckAll();
    this.obtenerBotones();
  }
  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

  async DescartarBorradoresAsincrono(checkboxGuias) {

    for (let checkboxGuia of checkboxGuias) {
      //oFacturaProveedorFormularioComponent.factura.detallefactura
      let id_borrador = $(checkboxGuia).val();
      let oc = await this.guiaService
        .descartarBorrador(id_borrador).toPromise();

    }

  }
  async  DescartarBorradores(event) {
    event.preventDefault();
    let checkboxGuias = $('#dtResultados').find('.checkboxGuia:checked');
    if (checkboxGuias.length <= 0) {
      swal({
        text: "Debe seleccionar una Guia.",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: "btn btn-warning"
      });
      return false;
    }

    swal({
      html: '¿Está seguro de descartar las guias seleccionadas?',
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


        oGuiaBuscarComponent.DescartarBorradoresAsincrono(checkboxGuias);



        setTimeout(function () {

          datatable.ajax.reload();
          swal({
            text: "Se descartó las guias seleccionadas.",
            type: 'success',
            buttonsStyling: false,
            confirmButtonClass: "btn btn-success"
          });

        }, 1000);





      },
      function (dismiss) {
      })




  }

}

function cargarDataTable() {

  let url = URL_BUSCAR_GUIA_BORRADOR;
  if (oGuiaBuscarComponent.filtro.publicada)
    url = URL_BUSCAR_GUIA;
  datatable = $('#dtResultados').on('draw.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[5, "desc"]],
    searching: false,
    serverSide: true,
    ajax: {

      beforeSend: function (request) {
        if (!oGuiaBuscarComponent.util.tokenValid()) {
          return;
        };
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('access_token'));
        request.setRequestHeader("origen_datos", 'PEB2M');
        request.setRequestHeader("tipo_empresa", 'P');
        request.setRequestHeader("org_id", localStorage.getItem('org_id'));
        request.setRequestHeader("Ocp-Apim-Subscription-Key", localStorage.getItem('Ocp_Apim_Subscription_Key'));
      },
      url: url,
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
      { data: 'NumeroGuia', name: 'NumeroGuia' },
      { data: 'DocumentoMaterial', name: 'DocumentoMaterial' },
      { data: 'Estado', name: 'Estado' },
      { data: 'RazonSocialCliente', name: 'RazonSocialCliente' },

      { data: 'FechaEmision', name: 'FechaEmision' },
      { data: 'FechaInicioTraslado', name: 'FechaInicioTraslado' },
      { data: 'FechaEstimadaArribo', name: 'FechaEstimadaArribo' },
      { data: 'CodigoGuia', name: 'CodigoGuia' },

    ],
    columnDefs: [
      { "className": "text-center", "targets": [1, 2, 3, 4, 5, 6, 7] },
      {

        render: function (data, type, row) {

          return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input class="checkboxGuia" value="' + row.CodigoGuia + '"  type="checkbox" name="optionsCheckboxes"></label></div></div>';
        },
        targets: 0,
        orderable: false
      },
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
        targets: 2,
      },
      {
        render: function (data, type, row) {
          let esBorrador = oGuiaBuscarComponent.filtro.publicada ? '0' : '1';

          let title = "Ver/Editar";
          if (oGuiaBuscarComponent.filtro.publicada)
            title = "Ver";
          //return data +' ('+ row[3]+')';
          return '<div class="text-center"><a href="/sm-guia/proveedor/formulario/' + row.CodigoGuia + '" row-id="' + row.CodigoGuia + '" esBorrador="' + esBorrador + '" id_doc="' + row.id_doc + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="' + title + '" data-placement="left"><i class="material-icons">visibility</i></button></a>' +
            '</div>';
        },
        targets: 8
      }
    ]
  });






  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');


    let row_id = $tr.find("a").attr('row-id');
    let esBorrador = $tr.find("a").attr('esBorrador');
    let id_doc = $tr.find("a").attr('id_doc');


    let nav = ['/sm-guia/proveedor/formulario', row_id, { b: esBorrador, c: id_doc }];

    oGuiaBuscarComponent.navigate(nav);
    event.preventDefault();

  });

  datatable.on('click', '.buscar-propuesta', function (event) {
    var $tr = $(this).closest('tr');

    var data = datatable.row($tr).data();

    let nav = ['/sm-guia/proveedor/buscar'];
    oGuiaBuscarComponent.navigate(nav);
    event.preventDefault();

  });


}
