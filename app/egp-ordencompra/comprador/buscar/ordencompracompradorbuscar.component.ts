import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';



import { OrdenCompraBuscar, OrdenCompraFiltros } from '../../../model/egp-ordencompra';

import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
declare var DatatableFunctions: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];

}
declare var $: any;
var oOrdenCompraCompradorBuscarComponent;
var datatable;
@Component({
  moduleId: module.id,
  selector: 'ordencompracompradorbuscar-cmp',
  templateUrl: 'ordencompracompradorbuscar.component.html',
  providers: [MasterService]
})

export class OrdenCompraCompradorBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public listEstadoCombo: ComboItem[];
  public resultados: OrdenCompraBuscar[];
  public filtro: OrdenCompraFiltros;
  private activatedRoute: ActivatedRoute;
  public id: string = '0';

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

    oOrdenCompraCompradorBuscarComponent = this;

   /* this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      /*
      this.esBorrador = params['b'];
      this.id_doc = params['c'];
      
    });*/


//alert(this.id);

    this.util.listEstadosRFQ(function (data: ComboItem[]) {
      oOrdenCompraCompradorBuscarComponent.listEstadoCombo = data;
    });

    this.filtro = {
      nroordencompra: null,
      estado: 'Activa',
      tipoorden: 'Material',
    };

    this.resultados = [
      {
        nroordencompra2: 40001,
        estado: 'Activa',
        tipoorden: 'Servicio',
        comprador: 'PROYECTO ESPECIAL DE INFRAESTRUCTURA DE TRANSPORTE NACIONAL - PROVIAS NACIONAL',
        proveedor: 'Pintado de Edificio S.A.',
        atenciona: 'Sr. José Rojas',
        version: '1',
        total: ' 32.000',
        fecharegistro: '26/02/2018',
      },
      {
        nroordencompra2: 40002,
        estado: 'Activa',
        tipoorden: 'Servicio',
        comprador: 'PROYECTO ESPECIAL DE INFRAESTRUCTURA DE TRANSPORTE NACIONAL - PROVIAS NACIONAL',
        proveedor: 'CPP',
        atenciona: 'Sr.Renzo Montoya ',
        version: '1',
        total: '35.000',
        fecharegistro: '26/02/2018',
      },
      {
        nroordencompra2: 40003,
        estado: 'Activa',
        tipoorden: 'Servicio',
        comprador: 'PROYECTO ESPECIAL DE INFRAESTRUCTURA DE TRANSPORTE NACIONAL - PROVIAS NACIONAL',
        proveedor: '3M',
        atenciona: 'Sra. Ana Carmen Chung',
        version: '1',
        total: '38.090',
        fecharegistro: '26/02/2018',
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
  let nroordencompra2 = item.nroordencompra2 as string;
  nroordencompra2 = nroordencompra2 + "";
  let nroordencomprafiltro = oOrdenCompraCompradorBuscarComponent.filtro.nroordencompra as string;
  if (nroordencomprafiltro) {
    nroordencomprafiltro = nroordencomprafiltro + "";
    return nroordencompra2.indexOf(nroordencomprafiltro) >= 0;
  }
  else return true;
}

function cargarDataTable() {

  datatable = $('#dtResultados').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({
    order: [[2, "asc"]],
    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/

    "ajax": function (data, callback, settings) {
      let datafiltered = oOrdenCompraCompradorBuscarComponent.resultados.filter(filtrarResultados);

      let result = {
        data: datafiltered

      };
      callback(
        result
      );
    },
    columns: [
      { data: 'nroordencompra2' },
      { data: 'nroordencompra2' },
      { data: 'estado' },
      { data: 'tipoorden' },
      { data: 'comprador' },
      { data: 'proveedor' },
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
          return '<div class="text-right"><a href="/egp-ordencompra/proveedor/formulario/' + row.nroordencompra + '" nroordencompra="' + row.nroordencompra + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left"><i class="material-icons">visibility</i></button></a>' +
            '<button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
            '<i class="material-icons">delete</i>' +
            '</button></div>';
        },
        targets: 10
      }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();
    //console.log($tr.find( "a" ).attr('nroordencompra'));
    let nroordencompra2 = $tr.find("a").attr('nroordencompra');
    let nav = ['/egp-ordencompra/comprador/formulario', nroordencompra2];

    oOrdenCompraCompradorBuscarComponent.navigate(nav);
    event.preventDefault();
  });


  datatable.on('click', '.remove', function (event) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();
    let resultados = oOrdenCompraCompradorBuscarComponent.resultados;
    let nroordencompra = $tr.find("a").attr('nroordencompra');
    var itemfiltrado = resultados.find(a => a.nroordencompra == nroordencompra);
    itemfiltrado.estado = 'Anulada';
    datatable.ajax.reload();
    event.preventDefault();
  });


}



