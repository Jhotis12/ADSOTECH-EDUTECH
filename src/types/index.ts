export interface Institucion {
    idInstitucion: number;
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
    idRol: number;
    nombre: string;
}

export interface Usuario {
    idUsuario: number;
    idInstitucion: number | null;
    idRol: number;
    auth_user_id: string | null;
    nombre: string;
    apellido: string;
    urlFotoPerfil: string | null;
    correo: string;
    telefono: string;
    genero: string;
    fechaRegistro: string;
    activo: boolean;
}

export interface PreguntaFrecuente {
    idPregunta: number;
    categoria: string;
    pregunta: string;
    respuesta: string;
}

export interface Recurso {
    idRecurso: number;
    idGrado: number | null;
    idAsignatura: number | null;
    titulo: string;
    tipo: string;
    url: string;
}

export interface Tramite {
    idTramite: number;
    nombre: string;
    descripcion: string;
}

export interface SolicitudTramite {
    idSolicitud: number;
    idUsuario: number;
    idTramite: number;
    fecha: string;
    estado: string;
    observacion: string | null;
}

export interface Comunicado {
    idComunicado: number;
    idInstitucion: number;
    titulo: string;
    mensaje: string;
    fecha: string;
    dirigidoA: string;
}

export interface Evento {
    idEvento: number;
    idInstitucion: number;
    titulo: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    tipo: string;
}
