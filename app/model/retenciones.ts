export class RetencionesBuscar {
    nroretenciones?: string;
    nroordenservicio: string;
    proveedor: string;
    cliente?: string;
    estado: string;
    fecharecepcion: string;


}

export class RetencionesFiltros {
    nroretenciones?: string;
    nroordenservicio?: string;
    estado?: string;
    fechacreacioninicio?: Date;
    fechacreacionfin?: Date;
    
    nroerp?: string;
}


export class Retenciones {
    nroretenciones: string;
    nroerpdocmaterial?: string;
    comprador: string;
    ruccomprador: string;

    rucproveedor: string;
    razonsocialproveedor: string;
    estadoComprador: string;
    estadoProveedor: string;
    estado?: string;
    fechaemision: Date;
    correoproveedor: string;
    moneda: string;
    moneda_txt?: string;


    recibidoaceptadopor: string;
    autorizadopor: string;
    fecharecepcion: Date;


    productos: Servicio[];
    constructor() {
        this.fechaemision = null;
        this.fecharecepcion = null;
        this.productos = [];
    }
    total?:string;
}


export class Servicio {
    id: number;
    nroitem: string;
    nroordenservicio: string;
    nroitemordenservicio: string;
    descripcion: string;
    cantidad: string;
    unidad: string;
    valorrecibido: string;
    es_subitem: boolean;
    tienesubitem :boolean;
}
