import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "../../../utils/app.utils";
import { MasterService } from '../../../service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { OrdenCompra } from "app/model/egp-ingresoc";
import '../../../../assets/js/plugins/jquery.PrintArea.js';


declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
var oOrdenCompraCompradorIngresoOCComponent;
var productos;
@Component({
  moduleId: module.id,
  selector: 'ordencompracompradoringresooc-cmp',
  templateUrl: 'ordencompracompradoringresooc.component.html',
  providers: [MasterService]
})

export class OrdenCompraCompradorIngresoOCComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: number = 0;

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadCombo: ComboItem[];

  public ordenes: OrdenCompra[];

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, ) {
    this.util = new AppUtils(this.router, this._masterService);

  }

  siguiente(event) {
    let nroordencompra = $("div.tab-pane.active").attr('id');
    console.log(nroordencompra);
    let oc = oOrdenCompraCompradorIngresoOCComponent.ordenes.find(a => a.nroordencompra === nroordencompra);
    if (oc.index == 3) {
      $("#aresumen").click();
    }
    else {
      let next = oc.index;
      next = next as number;
      next = ++next;
      console.log(next);
      $("#" + next).click();
      productos.columns.adjust().responsive.recalc();

    }


    event.preventDefault();

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id > 0) {
      this.toggleButton = true;

    } else {
      this.toggleButton = true;
    }

    this.ordenes = [
      {
        index: 1,

        tipo: "OC", //OS
        nroordencompra: "4590015491",
        estado: 'Activa',
        ruccontratista: "PE20100016681",
        moneda: 'SOLES', //'0000008'
        tipocambio: '1.0000', //'0000008'
        fecharegistro: "26/02/2017",
        fechanotificacion: "26/02/2017",
        fechacomprimisopresupuestal: "26/02/2017",
        nroexpedientesiaf: "4590015491",
        tipocontratacion: "",
        objetocontratacion: "SERVICIO",
        decripcioncontratacion: "",
        unidadesorganicascontratacion: "",
        unidadinformante: "",
        informacioncomplementaria: "",

        productos: [
          {
            posicion: '00001',
            micodigo: '00001',
            nombre: 'PINTADO',
            cantidad: '1.0000',
            unidad: 'UND',
            preciounitario: '32.000',
            total: '32.0000',
            fechaentrega: '20-07-2017',
          },
          {
            posicion: '00002',
            micodigo: '00002',
            nombre: 'LIMPIEZA',
            cantidad: '1.0000',
            unidad: 'UND',
            preciounitario: '18.000',
            total: '18.000',
            fechaentrega: '26-03-2018',
          },

        ],




      },
    /*  {
        index: 2,
        tipo: "OC", //OS
        nroordencompra: "4590015492",
        estado: 'Activa',
        ruccontratista: "PE20100016682",
        moneda: 'PEN', //'0000008'
        tipocambio: '1.0000', //'0000008'
        fecharegistro: "06/08/2017",
        fechanotificacion: "06/08/2017",
        fechacomprimisopresupuestal: "06/08/2017",
        nroexpedientesiaf: "4590015491",
        tipocontratacion: "",
        objetocontratacion: "Bien",
        decripcioncontratacion: "",
        unidadesorganicascontratacion: "",
        unidadinformante: "",
        informacioncomplementaria: "",



        productos: [
          {
            posicion: '00010',
            micodigo: '00010-4510648635',
            nombre: '',
            cantidad: '1.0000',
            unidad: 'UND',
            preciounitario: '285.0000',
            total: '285.0000',
            fechaentrega: '20-07-2017',
          },
          {
            posicion: '00020',
            micodigo: '00010-4510648635',
            nombre: 'CPU',
            cantidad: '1.0000',
            unidad: 'UND',
            preciounitario: '385.0000',
            total: '385.0000',
            fechaentrega: '20-07-2017',
          },

        ],




      },*/
     /* {
        index: 3,
        tipo: "OC", //OS
        nroordencompra: "4590015493",
        estado: 'Activa',
        ruccontratista: "PE20100016683",
        moneda: 'PEN', //'0000008'
        tipocambio: '1.0000', //'0000008'
        fecharegistro: "06/08/2017",
        fechanotificacion: "06/08/2017",
        fechacomprimisopresupuestal: "06/08/2017",
        nroexpedientesiaf: "4590015491",
        tipocontratacion: "",
        objetocontratacion: "Bien",
        decripcioncontratacion: "",
        unidadesorganicascontratacion: "",
        unidadinformante: "",
        informacioncomplementaria: "",



        productos: [
          {
            posicion: '00010',
            micodigo: '00010-4510648635',
            nombre: 'TECLADO',
            cantidad: '1.0000',
            unidad: 'UND',
            preciounitario: '285.0000',
            total: '285.0000',
            fechaentrega: '20-07-2017',
          },
          {
            posicion: '00020',
            micodigo: '00010-4510648635',
            nombre: 'MOUSE',
            cantidad: '1.0000',
            unidad: 'UND',
            preciounitario: '385.0000',
            total: '385.0000',
            fechaentrega: '20-07-2017',
          },

        ],




      }*/


    ]


    /* if (this.id != 4590015491) {
       
       this.item.productos = [
         {
           posicion: '10',
           micodigo: '',
           nombre: 'SRV SUSCRIPCION DIARIOS<br/>SRV SUSCRIPCION DIARIOS',
           cantidad: '',
           unidad: '',
           preciounitario: '',
           total: '330.5100',
           fechaentrega: '',
         },
         {
           posicion: '10.10',
           micodigo: '',
           nombre: 'SRV SUSCRIPCION DIARIOS<br/><b>Centro:</b> 6835 - Av. Argentina 3093 CALLAO<br/><b>Solicitud de pedido:</b> 0010534244',
           cantidad: '1.0000 ',
           unidad: 'SRV',
           preciounitario: '330.5100',
           total: '330.5100',
           fechaentrega: '20-07-2017',
         },
 
       ];
 
 
     
     }*/

    oOrdenCompraCompradorIngresoOCComponent = this;

    this.util.listPrioridades(function (data: ComboItem[]) {
      oOrdenCompraCompradorIngresoOCComponent.listPrioridadCombo = data;
    });

    this.util.listMonedas(function (data: ComboItem[]) {
      oOrdenCompraCompradorIngresoOCComponent.listMonedaCombo = data;
    });

    this.util.listUnidades(function (data: ComboItem[]) {
      oOrdenCompraCompradorIngresoOCComponent.listUnidadCombo = data;
    });

  }


  ngAfterViewInit() {




    $('.tab-oc').on("click", function () {
      setTimeout(function () { productos.columns.adjust().responsive.recalc() }, 300);


    });


    setTimeout(function () {

      $("#" + oOrdenCompraCompradorIngresoOCComponent.ordenes[0].nroordencompra).addClass('active');

      productos = $('.productos').DataTable({


        "ajax": function (data, callback, settings) {
          let nroordencompra = $(settings.nTable).closest("div.tab-pane").attr('id');

          let oc = oOrdenCompraCompradorIngresoOCComponent.ordenes.find(a => a.nroordencompra === nroordencompra);


          let result = {
            data: oc.productos

          };
          callback(
            result
          );
        },
        "createdRow": function (row, data, index) {

          /*
                  if (data.posicion === "10" || data.posicion === "20") {
                    $(row).addClass('highlight');
                    //$('td', row).eq(1).addClass('parent');
                  }
                  else {
                    //$(row).addClass('child');
                    $('td', row).eq(0).addClass('text-center');
                  }
          */
        },
        columns: [

          /* { data: 'posicion' },*/

          { data: 'nombre' },
          { data: 'cantidad' },
          { data: 'unidad' },
          { data: 'preciounitario' },
          { data: 'total' },
          { data: 'posicion' }
        ],

        columnDefs: [

          {
            render: function (data, type, row) {
              return '<div class="text-center"><a href="javascript:void(0)" posicion="' + row.posicion + '">' +
                '<button class="btn btn-simple btn-danger btn-icon remove" rel="tooltip" title="Eliminar" data-placement="left">' +
                '<i class="material-icons">delete</i>' +
                '</button></div>';
            },
            targets: 5
          }
        ]

      });


    }, 300);


  }


}
