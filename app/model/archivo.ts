export class Archivo {
    id: number;
    codigo: number;
    nombre: string;
    descripcion: string;
    nombreblob?:string;
    contenido?:any;
    url?:any;

    constructor() {
      this.descripcion='';
    }
  }