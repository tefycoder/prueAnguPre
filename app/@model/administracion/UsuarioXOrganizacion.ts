import { Contrato } from 'app/@model/administracion/Contrato';

export class UsuarioXOrganizacion {
    IdUsuarioXOrganizacion ?: string = '';
    IdOrganizacion ?: string = '';
    IdUsuario ?: string = '';
    IdRol ?: string = '';
    Campo1 ?: string = '';
    Campo2 ?: string = '';
    Campo3 ?: string = '';
    Cargo ?: string = '';
    CodigoInterno ?: string = '';
    Habilitado: number = 0; 
    Estado ?: string = '';
    Usuario: string;
    NombreCompleto: string;
    Rol: string;
    ListaContrato?:Contrato[];
}

