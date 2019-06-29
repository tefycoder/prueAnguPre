import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';

import { MomentModule } from 'angular2-moment/moment.module';
import { AppUtils } from "app/utils/app.utils";
import { MasterService } from 'app/service/masterservice';
import { ComboItem } from "app/model/comboitem";
import { OrdenCompra } from "app/model/ordencompra";
import 'app/../assets/js/plugins/jquery.PrintArea.js';


declare var moment: any;
declare var swal: any;

declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: string[][];
}
declare var $: any;
var oAsignarModulosCompradorFormularioComponent;
@Component({
  moduleId: module.id,
  selector: 'accesoorganizacionadminebizformulario-cmp',
  templateUrl: './accesoorganizacionadminebizformulario.component.html',
  providers: [MasterService]
})

export class AccesoOrganizacionAdminEbizFormularioComponent implements OnInit, AfterViewInit {

  public toggleButton: boolean = true;
  public id: number = 0;

  util: AppUtils;
  public listPrioridadCombo: ComboItem[];
  public listMonedaCombo: ComboItem[];
  public listUnidadCombo: ComboItem[];
  public item: OrdenCompra;

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private _masterService: MasterService, ) {
    this.util = new AppUtils(this.router, this._masterService);

  }

  print(event): void {
    if (this.id != 4590015491) {
      $("div#print-section-servicio").printArea({ popTitle: 'Orden de Servicio', mode: "iframe", popClose: false });
    }
    else
       $("div#print-section-material").printArea({ popTitle: 'Orden de Compra', mode: "iframe", popClose: false });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.id > 0) {
      this.toggleButton = true;

    } else {
      this.toggleButton = false;
    }


    this.item = {
    
      comprador: "GRUPO CENTENARIO S.A.",
      ruccomprador: "PE20600323980",
      tipo:"Compra",
      nroordencompra: "4590015491",
      proveedor: "SODIMAC PERU S.A.",
      rucproveedor: "PE20100016681",
      fecharegistro: "05-jul-2017",
      codigoproveedor: '110857210',
      flagcambio: 'SI',
      version: '1',
      moneda: 'USD', //'0000008'

      atenciona: 'Sr. ANTONIO TAFUR \n01-257364 / 94583901 \natafur@prueba.com',
      contactarcon: "JEANETTE ELSA COLLANTES SANTOS\n01-4583654\ncompras1@centenario.com.pe",
      preparadapor: 'Sr. Gonzalo Moscol',
      
      estadoweb: 'Aceptada',
      facturara: 'Centenario Retail S.A.C.\n20600323980\nAv. Victor Andrés Belaunde 147 . Vía\nPrincipal 102 . Edificio: Real Cuatro - Piso: 1, SAN ISIDRO - LIMA ',
      enviarfacturaa: 'Lunes, Miércoles y jueves de 9 am. a 1 pm.\nAv.Victor Andrés Belaunde 147.Edif. Real\n4,Sótano 1 - San Isidro\n01-5236589',
      
      formapago: 'Dentro de 45 días',
      fechainiciocontrato: '05-07-2017',
      fechafincontrato: '15-07-2017',
      grupocompra:'F56 - IC\nMkt. C.C. Minka',
      productos: [
        {
          posicion: '00010',
          micodigo: '00010-4510648635',
          nombre: 'EQUIPO DE SONIDO (RADIO GRABADOR)<br/>EQUIPO DE SONIDO (RADIO GRABADOR)<br/><b>Centro:</b> 6835 - Av. Argentina 3093 CALLAO<br/><b>Solicitud de pedido</b>: 0010534244	',
          cantidad: '1.0000',
          unidad:'UND',
          preciounitario: '285.0000',
          total: '285.0000',
          fechaentrega: '20-07-2017',
        },
        
      ],

      
     // autorizadopor: 'Aprobado Nivel 1: GMENDEZG\nAprobado Nivel 2: CVAZQUEG\nAprobado Nivel 3: CCHAVEZ\nAprobado Nivel 4: VPORTILLO',
      autorizadopor: 'Aprobado Nivel 1: GMENDEZG',
      
      subtotal: '285.0000',
      descuentos: '0.0000',
      valorventa: '285.0000',
      otroscostos: '0.0000',
      impuestos: '51.3000',
      valortotal: '336.3000',
      
    };
    if (this.id != 4590015491) {
      this.item.nroordencompra="4531046368";
      this.item.proveedor="EMPRESA EDITORA EL COMERCIO SA";
      this.item.rucproveedor="PE20143229816";
      this.item.codigoproveedor="110823232";
      this.item.moneda='PEN';
      this.item.tipo="Servicio";
      this.item.productos = [
        {
          posicion: '10',
          micodigo: '',
          nombre: 'SRV SUSCRIPCION DIARIOS<br/>SRV SUSCRIPCION DIARIOS',
          cantidad: '',
          unidad:'',
          preciounitario: '',
          total: '330.5100',
          fechaentrega: '',
        },
        {
          posicion: '10.10',
          micodigo: '',
          nombre: 'SRV SUSCRIPCION DIARIOS<br/><b>Centro:</b> 6835 - Av. Argentina 3093 CALLAO<br/><b>Solicitud de pedido:</b> 0010534244',
          cantidad: '1.0000 ',
          unidad:'SRV',
          preciounitario: '330.5100',
          total: '330.5100',
          fechaentrega: '20-07-2017',
        },
       
      ];


      this.item.subtotal = '330.5100';
      this.item.descuentos = '0.0000';
      this.item.valorventa = '330.5100';
      this.item.otroscostos = '0.0000';
      this.item.impuestos = '59.4918';
      this.item.valortotal = '390.0018';
    }

    oAsignarModulosCompradorFormularioComponent = this;

    this.util.listPrioridades(function (data: ComboItem[]) {
      oAsignarModulosCompradorFormularioComponent.listPrioridadCombo = data;
    });

    this.util.listMonedas(function (data: ComboItem[]) {
      oAsignarModulosCompradorFormularioComponent.listMonedaCombo = data;
    });

    this.util.listUnidades(function (data: ComboItem[]) {
      oAsignarModulosCompradorFormularioComponent.listUnidadCombo = data;
    });

  }


  ngAfterViewInit() {




    var dtArticulos = $('#dtArticulos').DataTable({
      /*"pagingType": "full_numbers",
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
      responsive: true,
      language: {
        sUrl: "assets/media/language/Spanish.json",
        search: "_INPUT_",
        searchPlaceholder: "Buscar Registros",
      },*/
      /* ajax: {
         "url": "https://jsonplaceholder.typicode.com/posts",
         "dataSrc": ""
       },*/

      "ajax": function (data, callback, settings) {
        let result = {
          data: oAsignarModulosCompradorFormularioComponent.item.productos

        };
        callback(
          result
        );
      },
      "createdRow": function (row, data, index) {


        if (data.posicion === "10" || data.posicion === "20") {
          $(row).addClass('highlight');
          //$('td', row).eq(1).addClass('parent');
        }
        else {
          //$(row).addClass('child');
          $('td', row).eq(0).addClass('text-center');
        }

      },
      columns: [

        { data: 'posicion' },

        { data: 'nombre' },
        { data: 'cantidad' },
        { data: 'unidad' },
        { data: 'preciounitario' },
        { data: 'total' },
        { data: 'fechaentrega' }
      ],

    });









  }


}
