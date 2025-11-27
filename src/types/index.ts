export interface Institucion {
    idinstitucion: number;
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
    tipo: string;
    calendario: string;
    departamento: string;
    ciudad: string;
}

export interface Rol {
    idrol: number;
    nombre: string;
}

export interface Usuario {
    idusuario: number;
    idinstitucion: number | null;
    idrol: number;
    nombre: string;
    apellido: string;
    urlfotoperfil: string | null;
    correo: string;
    telefono: string;
    genero: string;
    fecharegistro: string;
    contrasena_hash: string;
    activo: boolean;
}

export interface PreguntaFrecuente {
    idpregunta: number;
    categoria: string;
    pregunta: string;
    respuesta: string;
}

export interface Recurso {
    idrecurso: number;
    idgrado: number | null;
    idasignatura: number | null;
    titulo: string;
    tipo: string;
    url: string;
}

export interface Tramite {
    idtramite: number;
    nombre: string;
    descripcion: string;
}

export interface SolicitudTramite {
    idsolicitud: number;
    idusuario: number;
    idtramite: number;
    fecha: string;
    estado: string;
    observacion: string | null;
}

export interface Comunicado {
    idcomunicado: number;
    idinstitucion: number;
    titulo: string;
    mensaje: string;
    fecha: string;
    dirigidoa: string;
}

export interface Evento {
    idevento: number;
    idinstitucion: number;
    titulo: string;
    descripcion: string;
    fechainicio: string;
    fechafin: string;
    tipo: string;
}
