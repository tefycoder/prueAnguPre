export class Proveedor {
    id: number;
      rucdni: string;  
      razonsocial: string;
      proveedorcalificaciones: ProveedorCalificacion[]
  }
  
  export class CalificarProveedor {
      id: number;
      proveedor: string;  
      tipooc: string;
      nroocos: string;
      descripcion: string;
      entidadcompradora: string;
      usuariocomprador: string;
      calificarpreguntas: CalificarPreguntas[]
  }
  
  export class CalificarPreguntas {
      id: number;
      pregunta: string;  
      calificacion: number;
  }
  
  export class ProveedorCalificacion {
      id: number;
      nrooc: string;  
      tipoocos: string;
      usuariocomprador: string;
      entidadcompradora: string;
      calificacion: number;
      fechacreacion:string;
  }
  
  export class CalificacionFiltros {
      rucdni: string;  
      razonsocial: string;
      nrooc: string;
      entidadcompradora: string;
  }
  
  export class CalificacionBuscar {
      rucdni: string;  
      razonsocial: string;
      calificacion: number;
      id: number;
  }
  