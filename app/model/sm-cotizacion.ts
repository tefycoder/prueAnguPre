import { Archivo } from 'app/model/archivo';
import { RFQCompradoBuscar/*, AtributoxProducto*/ } from 'app/model/sm-rfqcomprador';

    export class CotizacionFiltro{
        nsolicitud:string;
        nseguimiento:string;
        estado:string;
        fechainicio:Date;
        fechafin:Date;
        publicada?: boolean;
        /*
        constructor() {
            this.nsolicitud='';
            this.nseguimiento='';
            this.estado='';
            this.fechainicio=null;
            this.fechafin=null;
            this.publicada = false;
        }
        */
    }

    export class CotizacionBuscar {
        nrocotizacion: string;
        orgproveedora: string;
        usuarioproveedor: string;
        estado: string;
        version:string;
        fechacreacion: string;
        oc:string;
    }


    export class Cotizacion {
        id_doc?: string;
        IdBorrador?:string;
        // id: string;
        // qtreferencia:string;
        idrfq: string;
        numerorfq: string;
        version: string;
        orgpro: string;
        orgcom: string;
        nomorgcom: string; 
        nomorgpro: string;
        nomusucom: string;
        nomusupro: string;
        fechacreacion?: Date;
        fechaemision?: Date;
        numeroseguimiento: string;
        area: string;
        estado?: string;
        estadorfqcomprador: string;
        // estado_txt?:string;
        estadolargo:string;
        idmoneda:string;
        // idmoneda_txt:string;
        mensaje:string;
        // habilitado:number;

        atributos: Primero[];
        productos: Producto[];
        docadjuntos?: Archivo[];

        constructor() {
            this.fechacreacion = null;
            this.fechaemision = null;
            // this.fchentregapro = null;
            // this.fechainicio=null;
            // this.fechafin=null;
            this.docadjuntos = [];
            this.atributos = [];
            this.productos =[];
            this.nomusucom = '';
        }
    }

    export class Primero{
        idatributo: string;
        nombreatributo: string;
        valorenviado: string;
        nombreunidad: string;
        modificable: string;
        mandatorio: string;
        atributovalortipodato: string;
        // habilitado: number;
    }

    export class Atributo {
        nombre: string;
        operador: string;
        valor: string;
        unidad: string;
        obligatorio: string;
        atributovalortipodato: string;
    }

    export class Producto {
        constructor() {
        //    this.fechaentrega = null; 
            this.atributos = [];
            this.idproducto='';
        }

 //       id: number;
        idproducto: string;
 //       posicion: string; /* posiscion */
        codigoproducto?: string;
        nombreproducto: string;
        descripcionproducto:string;
        //cantidadbase: number;
//        unidad: string;
//        cantidad: number;
 //       precio: number;
        //adjuntos: string;
 //       fechaentrega: Date;

        atributos?: AtributoxProducto[];
        //objetocontrato?: string;
    }

    export class AtributoxProducto{
        constructor() {
            this.idatributo = '';
            this.nombre = '';
            this.valoreditable = '';
            this.obligatorio = '';
            this.valor = '';
            this.valorunidad = '';
            this.valortipodato = '';
        }
        idatributo?:string;
        nombre?:string;
        valoreditable?:string;
        obligatorio?:string;
        valor?:string;
        valorunidad?:string;
        valortipodato?:string;
    }

      
    export class ProductoAux{
        constructor() {
            this.id = 0;
            this.idproducto = '';
            this.posicion = '';
            this.codigoproducto = '';
            this.nombreproducto = '';
            this.descripcionproducto = '';
            this.nroparte = '';
            this.cantidadsolicitada = '';
            this.precio = '';
            this.unidad = '';
            this.cantidadofrecida = '';
            this.fechaentrega = '';
            this.esmodificableprecio=false;
            this.esmodificableunidad=false;
            this.esmodificablecantidadofrecida=false;
            this.esmodificablefechaentrega=false;
            this.atributos = [];

            // this.fechaentrega = null;
        }
    
        id: number;
        idproducto: string;
        posicion: string;
        codigoproducto: string;
        nombreproducto: string;
        descripcionproducto: string;      
        nroparte:string;
        cantidadsolicitada: string;
        precio: string;
        unidad: string;
        cantidadofrecida: string;
        fechaentrega: string;
        esmodificableprecio: boolean;
        esmodificableunidad: boolean;
        esmodificablecantidadofrecida: boolean;
        esmodificablefechaentrega: boolean;
        atributos: AtributoxProductoAux[];

        //fechaentrega: Date;
  }
  
  export class AtributoxProductoAux{
    constructor() {
        this.nombreatributo = '';
        this.valorenviado = '';
        this.nombreunidad = '';
        this.modificable = '';
        this.mandatorio = '';
        this.atributovalortipodato = '';
        this.idproductoxrfq = '';
        this.idrfq = '';
        this.idatributo = '';       
        this.esvisible=true;
    }
    nombreatributo:string;
    valorenviado:string;
    nombreunidad:string;
    modificable:string;
    mandatorio:string;
    atributovalortipodato: string;
    idproductoxrfq: string;
    idrfq: string;
    idatributo: string;
    esvisible:boolean;
}     
    
    