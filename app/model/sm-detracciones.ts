//import { Caracteristicas } from "app/model/retenciones";
//import { Archivo } from "app/model/archivo";
export class DetraccionBuscar{
    nroconstancia:string;
    razonsocialcomprador:string;
    ruccomprador:string;
    fechapago:Date;
    moneda:string;
    montototal:string;
    estado: string;
    
}

export class DetraccionFiltros{

    nrodetracciondesde?:string;
    nrodetraccionhasta?:string;
    ruccompradora?:string;
    nrofactura?: string;
    estado?:string;
    fechapagoinicio?:Date;
    fechapagofin?:Date;

}
export class Detraccion {
    //vista de arriba
    razonsocialcomprador: string;
    ruccomprador: string;
    nroconstancia: string;

    razonsocialprov: string;
    direccionprov:string;
    rucproveedor: string;
    nrocuentadetraccion: string;
    nrodocpagoerp: string;
    nrooperacion: string;

    codbienservicio: string;
    nombienservicio:string;

    montodeposito:number;
    fechapago: Date;
    //estado: string;

    codtipooperacion:string;
    nrotipooperacion:string;

    periodotributario: string;
    observacion: string;
    detalles: Caracteristicas [];
    
    constructor(){
        this.fechapago = null;
        //this.docadjuntos = [];
        //this.fecharecepcion = null;
        this.detalles = []; //viene de orden de compra en HAS
    }
    
    
    /*public total?:string;
    public total2?:number;
    public total3?:number;*/
    //public total: number;
    totalmontopago: string;
    totalmontodetraccion?: string;
    totalsaldofactura?:string;
    //docadjuntos?: Archivo[];
}
export class Caracteristicas{

    id: number;
    tipodocumento : string;
    seriedocumento: string;
    nrodocumento: string;
    fechadocumento: Date;
    monedadet: string;
    tipocambio:number;
    montooriginal:number;
    montopago:number;
    montodetractado:number;
    saldofactura:number;
    
    

}