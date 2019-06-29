import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



import { OrdenCompraBuscar} from 'app/model/ordencompra';

import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
declare var DatatableFunctions: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}

declare var $: any;
var oAsignarModulosCompradorBuscarComponent;
var datatable;

@Component({
  moduleId: module.id,
  selector: 'accesoorganizacionadminebizbuscar-cmp',
  templateUrl: './accesoorganizacionadminebizbuscar.component.html',
  providers: [MasterService]
})

export class AccesoOrganizacionAdminEbizBuscarComponent implements OnInit, AfterViewInit {
  util: AppUtils;
  public dtResultdos: DataTable;
  public listEstadoCombo: ComboItem[];
  public resultados: any [];//OrdenCompraBuscar[];
  //public filtro: OrdenCompraFiltros;

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

    oAsignarModulosCompradorBuscarComponent = this;

    /*this.util.listEstadosRFQ(function (data: ComboItem[]) {
      oOrdenCompraCompradorBuscarComponent.listEstadoCombo = data;
    });
    this.filtro = {

      nroordencompra: null,
      estado: 'Activa',
      tipoorden: 'Material',
    }*/
    this.resultados = [
      {

        ruc:'1071710985',
        razonsocial: 'SUPERMIX S.A',
        contrato: '000298898',
        fechacreacion: '10/02/2018',
      },

      {
        ruc:'1071710985',
        razonsocial: 'CENTENARIO S.A',
        contrato: '000298898',
        fechacreacion: '12/02/2018',
      },
    ];

    this.dtResultdos = {
      headerRow: ['RUC', 'Razon Social', 'Contrato', 'Fecha Creacion', 'Acciones'],
      footerRow: ['RUC', 'Razon Social', 'Contrato', 'Fecha Creacion', 'Acciones'],

      dataRows: [
        ['10717109185', 'SUPERMIX S.A', '000298898', '10/02/2018'],
        ['20548965466', 'CENTENARIO S.A', '000298898', '12/02/2018'],
      ]
    };
  }

  ngAfterViewInit() {


    cargarDataTable();
    DatatableFunctions.registerCheckAll();
  }


}
function filtrarResultados(item) {
  //
  /*let nroordencompra = item.nroordencompra as string;
  nroordencompra = nroordencompra + "";
  let nroordencomprafiltro = oOrdenCompraCompradorBuscarComponent.filtro.nroordencompra as string;
  if (nroordencomprafiltro) {
    nroordencomprafiltro = nroordencomprafiltro + "";
    return nroordencompra.indexOf(nroordencomprafiltro) >= 0;
  }
  else return true;*/
}

function cargarDataTable() {

  /*datatable = $('#dtResultados').on('init.dt', function (e, settings, json) {
    DatatableFunctions.initDatatable(e, settings, json, datatable);
  }).DataTable({*/
    var datatable = $('#dtResultados').DataTable({
    order: [[1, "asc"]],
    /* ajax: {
       "url": "https://jsonplaceholder.typicode.com/posts",
       "dataSrc": ""
     },*/

    "ajax": function (data, callback, settings) {
      /*let datafiltered = oOrdenCompraCompradorBuscarComponent.resultados.filter(filtrarResultados);*/

      let result = {
        data: oAsignarModulosCompradorBuscarComponent.resultados

      };
      callback(
        result
      );
    },
    columns: [
      { data: 'ruc' },
      { data: 'ruc' },
      { data: 'razonsocial' },
      { data: 'contrato' },
      { data: 'fechacreacion' },
    ],
    columnDefs: [
      {
        render: function (data, type, row) {
          return '<div class="text-center" height="100%"><div class="checkbox text-center"><label><input type="checkbox" name="optionsCheckboxes"></label></div></div>';
        },
        targets: 0
      },
      {
        render: function (data, type, row) {
          return '<div class="text-center"><a href="/accesoorganizacion/adminebiz/formulario/' + row.ruc + '" nroordencompra="' + row.ruc + '">' +
            '<button class="btn btn-simple btn-info btn-icon edit" rel="tooltip" title="Ver/Editar" data-placement="left"><i class="material-icons">visibility</i></button></a>';
        },
        targets: 5
      }
    ]
  });


  datatable.on('click', '.edit', function (event) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();
    //console.log($tr.find( "a" ).attr('nroordencompra'));
    let nroordencompra = $tr.find("a").attr('nroordencompra');


    let nav = ['/accesoorganizacion/adminebiz/formulario', nroordencompra];

    oAsignarModulosCompradorBuscarComponent.navigate(nav);
    event.preventDefault();

  });

  /*datatable.on('click', '.remove', function (event) {
    var $tr = $(this).closest('tr');
    var data = datatable.row($tr).data();
    let resultados = oOrdenCompraCompradorBuscarComponent.resultados;
    let nroordencompra = $tr.find("a").attr('nroordencompra');
    var itemfiltrado = resultados.find(a => a.nroordencompra == nroordencompra);
    itemfiltrado.estado = 'Anulada';
    datatable.ajax.reload();
    event.preventDefault();

  });
*/

}



