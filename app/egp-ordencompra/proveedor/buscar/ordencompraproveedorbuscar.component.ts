import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



import { OrdenCompraBuscar, OrdenCompraFiltros } from '../../../model/egp-ordencompra';

import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";


declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $: any;
declare var DatatableFunctions: any;
var oOrdenCompraProveedorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'ordencompraproveedorbuscar-cmp',
  templateUrl: 'ordencompraproveedorbuscar.component.html',
  providers: [MasterService]
})

export class OrdenCompraProveedorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: OrdenCompraBuscar[];
  public filtro: OrdenCompraFiltros;

  public navigate(nav) {

    this.router.navigate(nav, { relativeTo: this.route });
  }
  constructor(private router: Router, private route: ActivatedRoute, private _masterService: MasterService) {
    this.util = new AppUtils(this.router, this._masterService);
  }
  clicked(event) {

    datatable.ajax.reload();
    //datatable.ajax.url( "http://b2miningdata.com/rfqp/v1/rfqproveedor/v1/listvm/1" ).load();
    event.preventDefault();
  }




  ngOnInit() {

    oOrdenCompraProveedorBuscarComponent = this;

    this.util.listEstadosRFQ(function (data: ComboItem[]) {
      oOrdenCompraProveedorBuscarComponent.listEstadoCombo = data;
    });
    this.filtro = {

      nroordencompra: null,
      estado: 'Activa',
      tipoorden: 'Material',
    }
    this.resultados = [
      {
        nroordencompra: 4590015491,
        estado: 'Activa',
        tipoorden: 'Material',
        comprador: 'TELLO MARCOS',
        proveedor: 'SODIMAC PERU S.A.',
        atenciona: 'Sr. ANTONIO TAFUR',
        version: '1',
        total: 'USD 336.3000',
        fecharegistro: '05/07/2017',
        empresacompradora: 'Grupo Centenario S.A.',

      },

      {
        nroordencompra: 4531046368,
        estado: 'Rechazada',
        tipoorden: 'Servicio',
        comprador: 'TELLO MARCOS',
        proveedor: 'EMPRESA EDITORA EL COMERCIO SA',
        atenciona: 'Sr. ANTONIO TAFUR ',
        version: '1',
        total: 'PEN 390.0018',
        fecharegistro: '05/07/2017',
        empresacompradora: 'Grupo Centenario S.A.',
      },


      {
        nroordencompra: 4531046371,
        estado: 'Visualizada',
        tipoorden: 'Servicio',
        comprador: 'PEREDO EDSON',
        proveedor: 'ENERGIA Y SERVICIOS PERU SAC',
        atenciona: 'Sr. Mario Bobadilla',
        version: '1',
        total: 'PEN 388.0900',
        fecharegistro: '27/01/2017',
        empresacompradora: 'Grupo Centenario S.A.',
      },
      {
        nroordencompra: 4531046600,
        estado: 'Aceptada',
        tipoorden: 'Servicio',
        comprador: 'URIBE RENZO LUIS',
        proveedor: 'ENERGIA Y SERVICIOS PERU SAC',
        atenciona: 'Sr. Norma Campero',
        version: '1',
        total: 'PEN 374.6400',
        fecharegistro: '27/01/2017',
        empresacompradora: 'Grupo Centenario S.A.',
      },
    ];
  }

  ngAfterViewInit() {


    cargarDataTable();
    DatatableFunctions.registerCheckAll();

  }


}

function filtrarResultados(item) {
  //
  let nroordencompra = item.nroordencompra as string;
  nroordencompra = nroordencompra + "";
  let nroordencomprafiltro = oOrdenCompraProveedorBuscarComponent.filtro.nroordencompra as string;
  if (nroordencomprafiltro) {
    nroordencomprafiltro = nroordencomprafiltro + "";
    return nroordencompra.indexOf(nroordencomprafiltro) >= 0;
  }
  else return true;
}

function cargarDataTable() {

  datatable = $('#dtResultados').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[1, "desc"]],
    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/

    "ajax": function (data, callback, settings) {
      let datafiltered = oOrdenCompraProveedorBuscarComponent.resultados.filter(filtrarResultados);
      //console.log("datafiltered", datafiltered);
      let result = {
        data: datafiltered

      };

      callback(
        result
      );
    },
    columns: [
      { data: 'nroordencompra' },
      { data: 'nroordencompra' },
      { data: 'estado' },
      { data: 'tipoorden' },
      { data: 'empresacompradora' },
      { data: 'comprador' },
      { data: 'atenciona' },
      { data: 'version' },
      { data: 'total' },
      { data: 'fecharegistro' },
      { data: 'nroordencompra' }
    ],
    columnDefs: [

      {

        render: function (data, type, row) {
          return '<div class="text-right" height="100%"><div class="checkbox text-right"><label><input type="checkbox" name="optionsCheckboxes"></label></div></div>';
        },

        targets: 0
      },
      {

        render: function (data, type, row) {

          //return data +' ('+ row[3]+')';
          return '<div class="text-center"><a href="/egp-ordencompra/proveedor/formulario/' + row.nroordencompra + '" nroordencompra="' + row.nroordencompra + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left">' +
            '<i class="material-icons">visibility</i></button></a>' +
            '</div>';
        },
        targets: 10
      }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');

    var data = datatable.row($tr).data();
    //console.log("click edit", event);
    let nroordencompra = $tr.find("a").attr('nroordencompra');

    //console.log("click edit", oOrdenCompraProveedorBuscarComponent);
    let nav = ['/egp-ordencompra/proveedor/formulario', nroordencompra];

    oOrdenCompraProveedorBuscarComponent.navigate(nav);
    event.preventDefault();

  });



}



