export class RFQBuscar{
    idrfq: string;
    numeroseguimientorfq: string;
    descripcion: string;
    estado: string;
    fechacreacion: Date;
    nombreusuario: string;
    //nombreorgcompradora: string;
    version: string;
    cotizaciones: string;
}

export class RFQFiltro{
    numeroseguimientorfq:string;
    estado:string;
    fechacreacioninicio:Date;
    fechacreacionfin:Date;
   
}

export class RequerimientoProvBuscar{
    orgcompradora: string;
    comprador: string;
    nrosolcotizacion: string;
    estado: string;
    fechacreacion: string;
    vendedor: string;
    version: string;
    cotemitida: string;
}


export class RequerimientoProveedor {
       constructor() {
        this.docadjuntos = [];
        this.productos = [];
    }
    public organizacioncompradora: string;
    public nroreq: number;

    public prioridad: string;
    public moneda: string;
    public estado: string;
    public descripcion: string;
    public unidadorganicas: string;
    public notas: string;

    public fechainicio: string;
    public fechafin: string;
    public fechainiciod: string;
    public fechafind: string;
    public fechainiciot: string;
    public fechafint: string;
    public productos?: Producto[];//productos arreglo
    public docadjuntos: Archivo[];
        id: number;




}
export class Archivo {
    id: number;
    descripcion: string;

}


export class Producto {

    posicion: number; // posiscion 
    codigoproducto: string;
    nombreproducto: string;
    objetocontrato: string;
    cantidad: string;
    unidad: string;
    atributos?: Atributo[];
}

export class Atributo {
    nombre: string;
    operador: string;
    valor: string;
    unidad: string;
    obligatorio: string;
}

