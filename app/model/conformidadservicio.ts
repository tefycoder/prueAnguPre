export class ConformidadServicioBuscar {
    nroconformidadservicio?: string;
    nroordenservicio: string;
    proveedor: string;
    cliente?: string;
    estado: string;
    fecharecepcion: string;
}


export class ConformidadServicioFiltros {
    nroconformidadservicio?: string;
    nroordenservicio?: string;
    estado?: string;
    fechacreacioninicio?: Date;
    fechacreacionfin?: Date;
    
    nroerp?: string;
}


export class ConformidadServicio {
    nroconformidadservicio: string;
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
    CodigoHASERP? : string;
    EjercicioHAS? : string;
    
    constructor() {
        this.fechaemision = null;
        this.fecharecepcion = null;
        this.productos = [];
    }
    total?:string;
}


export class Servicio {
    constructor() {
        this.NumeroParte = '';
       this.cantidadatendida='';
    }
    id: number;
    nroitem: string;
    nroordenservicio: string;
    nroitemordenservicio: string;
    nroitemhas: string;
    descripcion: string;
    estado: string;
    servicio: string;
    cantidad: string;
    unidad: string;
    valorrecibido: string;
    es_subitem: boolean;
    tienesubitem :boolean;
    IdServicioxHAS?: string;
    IdTablaUnidad?: string;
    IdRegistroUnidad?: string;
    NumeroParte?: string;
    IdHAS?: string;
    cantidadatendida? : string;
    PrecioItem?: string;
}
