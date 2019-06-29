export class RetencionesBuscar {

    nrocomprobante:string;
    orgcompradora : string;
    ruccomprador: string;
    fechaemision: string;
    moneda: string;
    impretenido: string;
    estado: string;		
}

export class RetencionesFiltros {

    nroretencioninicio?: string;			
    nroretencionfin?: string;		
    ruc?: string;		
    fechaemisioninicio?: Date;			
    nrofactura?: string;			
    fechaemisionfin?: Date;			
    estado?: string;	
   
}


export class Retenciones {
   razonsocialcompradora:string;
   ruccompradora:string;
   serieretencion:string;
   numeroretencion:string;

   rucproveedora:string;
   razonsocialprov: string;
   direccionproveedora:string;
   txtnrodocpagoerp:number;
   moneda:string;
   fechaemision: Date;
   banco: string;
   estado: string;
   tipocambio: number;
    numcorrida: string;
    obs:string;
    detalle:Caracteristicas [];

    constructor(){
        this.fechaemision = null;
        //this.fecharecepcion = null;
        this.detalle = []; //viene de orden de compra en HAS
    }


}


export class Caracteristicas {
    ditemretencion: string;
    dtipodocumento: string;
    dseriedocumento: string;
    dnumerodocumento: string;
    dfechadocumento: Date;
    dmoneda: string;
    dmontoorigen: number;
    dmontopago: number;
    dmontoretenido: number;
    dvcnrodocerpitem: string;

    
  
}
