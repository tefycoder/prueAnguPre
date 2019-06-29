//import {Cotizacion} from "app/model/sm-cotizacion";
import {RFQCompradoBuscar} from "app/model/sm-rfqcomprador";
import {Cotizacion as Cotizacion2 } from "app/model/sm-cotizacion";

export class CotizacionMS {
    POSTQT: POSTQT;
    cotizacion?: Cotizacion2;
    recurso?: string;
    vc_numeroseguimiento?: string;
    session_id?: string;
    id_doc?:string;
}


export class POSTQT {
    constructor(){
        this.IdRfq='';
        this.NumeroRfq='';
       // this.Cotizacion=[];        
    }
    IdRfq?: string     
    NumeroRfq?: string 

    Cotizacion?:Cotizacion;
}


export class Cotizacion {
    fechacreacion?:Date;
    fechaemision?:Date;
    
    VersionCotizacion?: string; 
    FechaCotizacion?: string;
    CodigoProveedor?:string;
    NombreVendedor?:string;
    NumeroSeguimiento?:string;
    Notas?:string;
    Moneda?: string;
    NomOrgCom?:string;
   
    Atributo: Atributo[];
    Producto: Producto[];
    Archivos: Archivo[]

    constructor(){
        this.Atributo=[];
        this.Producto=[];
        this.Archivos=[];
    }
}


export class Atributo{
    atributonombre?: string;
    atributovalor?:string;
    atributovalorunidad?:string;
    atributovaloreditable?:string;
    atributoobligatorio?:string;
    atributovalortipodato?:string;
}


export class Producto{
    constructor(){
        this.atributoproducto=[];
    }

    codigoproducto: string;
    nombreproducto: string;
    descripcionproducto:string;
    atributoproducto:AtributoxProducto[];
}

export class AtributoxProducto{
    atributoproductonombre?:string;
    atributoproductovaloreditable?:string;
    atributoproductoobligatorio?:string;
    atributoproductovalor?:string;
    atributoproductovalorunidad?:string;
    atributoproductovalortipodato?:string;
}

export class Archivo{
    nombre?: string;
    archivo?: string;
    url?: string;
}

