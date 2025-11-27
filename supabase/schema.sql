-- ===========================================
-- LIMPIEZA SEGURA (Ejecuta solo si es necesario)
-- ===========================================
DROP TABLE IF EXISTS EstadisticaUso CASCADE;
DROP TABLE IF EXISTS Interaccion CASCADE;
DROP TABLE IF EXISTS SolicitudTramite CASCADE;
DROP TABLE IF EXISTS Tramite CASCADE;
DROP TABLE IF EXISTS PreguntaFrecuente CASCADE;
DROP TABLE IF EXISTS Recurso CASCADE;
DROP TABLE IF EXISTS Comunicado CASCADE;
DROP TABLE IF EXISTS Evento CASCADE;
DROP TABLE IF EXISTS Nota CASCADE;
DROP TABLE IF EXISTS Evaluacion CASCADE;
DROP TABLE IF EXISTS Asistencia CASCADE;
DROP TABLE IF EXISTS Horario CASCADE;
DROP TABLE IF EXISTS DocenteAsignaturaGrupo CASCADE;
DROP TABLE IF EXISTS Matricula CASCADE;
DROP TABLE IF EXISTS PadreEstudiante CASCADE;
DROP TABLE IF EXISTS Grupo CASCADE;
DROP TABLE IF EXISTS Grado CASCADE;
DROP TABLE IF EXISTS Asignatura CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Rol CASCADE;
DROP TABLE IF EXISTS Institucion CASCADE;

-- ===========================================
-- INSTITUCIONES
-- ===========================================
CREATE TABLE Institucion (
  idInstitucion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50),
  direccion VARCHAR(100),
  telefono VARCHAR(20),
  correo VARCHAR(50),
  tipo VARCHAR(25),
  calendario VARCHAR(50),
  departamento VARCHAR(50),
  ciudad VARCHAR(50)
);

-- ===========================================
-- ROLES
-- ===========================================
CREATE TABLE Rol (
  idRol INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- ===========================================
-- USUARIOS (Vinculados con auth.users)
-- ===========================================
CREATE TABLE Usuario (
  idUsuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- Relación con institución
  idInstitucion INT REFERENCES Institucion(idInstitucion) ON DELETE SET NULL,

  -- Rol académico
  idRol INT REFERENCES Rol(idRol) ON DELETE RESTRICT,

  -- Auth Supabase
  auth_user_id UUID UNIQUE,   -- ← Vincula este usuario con auth.users.id

  -- Información del usuario
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  urlFotoPerfil VARCHAR(255),
  correo VARCHAR(120),
  telefono VARCHAR(20),
  genero VARCHAR(20),
  fechaRegistro TIMESTAMP DEFAULT NOW(),
  
  activo BOOLEAN DEFAULT TRUE
);

-- ===========================================
-- PADRE - ESTUDIANTE
-- ===========================================
CREATE TABLE PadreEstudiante (
  idPadre INT REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
  idEstudiante INT REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
  relacion VARCHAR(50),
  PRIMARY KEY (idPadre, idEstudiante)
);

-- ===========================================
-- GRADOS
-- ===========================================
CREATE TABLE Grado (
  idGrado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50)
);

-- ===========================================
-- GRUPOS
-- ===========================================
CREATE TABLE Grupo (
  idGrupo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idGrado INT REFERENCES Grado(idGrado) ON DELETE CASCADE,
  nombre VARCHAR(50)
);

-- ===========================================
-- MATRÍCULAS
-- ===========================================
CREATE TABLE Matricula (
  idMatricula INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idEstudiante INT REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
  idGrupo INT REFERENCES Grupo(idGrupo) ON DELETE CASCADE,
  año INT,
  fecha TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- ASIGNATURAS
-- ===========================================
CREATE TABLE Asignatura (
  idAsignatura INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50)
);

-- ===========================================
-- DOCENTE ASIGNA MATERIA A GRUPO
-- ===========================================
CREATE TABLE DocenteAsignaturaGrupo (
  idDAG INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idDocente INT REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
  idAsignatura INT REFERENCES Asignatura(idAsignatura) ON DELETE CASCADE,
  idGrupo INT REFERENCES Grupo(idGrupo) ON DELETE CASCADE
);

-- ===========================================
-- HORARIOS
-- ===========================================
CREATE TABLE Horario (
  idHorario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idDAG INT REFERENCES DocenteAsignaturaGrupo(idDAG) ON DELETE CASCADE,
  diaSemana VARCHAR(20),
  horaInicio TIME,
  horaFin TIME
);

-- ===========================================
-- ASISTENCIA
-- ===========================================
CREATE TABLE Asistencia (
  idAsistencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idMatricula INT REFERENCES Matricula(idMatricula) ON DELETE CASCADE,
  fecha DATE,
  estado VARCHAR(20)
);

-- ===========================================
-- EVALUACIONES & NOTAS
-- ===========================================
CREATE TABLE Evaluacion (
  idEvaluacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idDAG INT REFERENCES DocenteAsignaturaGrupo(idDAG) ON DELETE CASCADE,
  titulo VARCHAR(100),
  descripcion VARCHAR(255),
  fecha DATE,
  tipo VARCHAR(50)
);

CREATE TABLE Nota (
  idNota INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idEvaluacion INT REFERENCES Evaluacion(idEvaluacion) ON DELETE CASCADE,
  idMatricula INT REFERENCES Matricula(idMatricula) ON DELETE CASCADE,
  nota NUMERIC(4,2)
);

-- ===========================================
-- EVENTOS ACADÉMICOS
-- ===========================================
CREATE TABLE Evento (
  idEvento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idInstitucion INT REFERENCES Institucion(idInstitucion) ON DELETE CASCADE,
  titulo VARCHAR(100),
  descripcion VARCHAR(255),
  fechaInicio TIMESTAMP,
  fechaFin TIMESTAMP,
  tipo VARCHAR(50)
);

-- ===========================================
-- COMUNICADOS
-- ===========================================
CREATE TABLE Comunicado (
  idComunicado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idInstitucion INT REFERENCES Institucion(idInstitucion) ON DELETE CASCADE,
  titulo VARCHAR(100),
  mensaje TEXT,
  fecha TIMESTAMP DEFAULT NOW(),
  dirigidoA VARCHAR(50)
);

-- ===========================================
-- RECURSOS EDUCATIVOS
-- ===========================================
CREATE TABLE Recurso (
  idRecurso INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idGrado INT REFERENCES Grado(idGrado) ON DELETE SET NULL,
  idAsignatura INT REFERENCES Asignatura(idAsignatura) ON DELETE SET NULL,
  titulo VARCHAR(100),
  tipo VARCHAR(50),
  url VARCHAR(255)
);

-- ===========================================
-- FAQ
-- ===========================================
CREATE TABLE PreguntaFrecuente (
  idPregunta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  categoria VARCHAR(50),
  pregunta VARCHAR(255),
  respuesta TEXT
);

-- ===========================================
-- TRÁMITES
-- ===========================================
CREATE TABLE Tramite (
  idTramite INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion VARCHAR(255)
);

CREATE TABLE SolicitudTramite (
  idSolicitud INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idUsuario INT REFERENCES Usuario(idUsuario) ON DELETE CASCADE,
  idTramite INT REFERENCES Tramite(idTramite) ON DELETE CASCADE,
  fecha TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50),
  observacion VARCHAR(255)
);

-- ===========================================
-- INTERACCIONES DEL CHATBOT
-- ===========================================
CREATE TABLE Interaccion (
  idInteraccion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idUsuario INT REFERENCES Usuario(idUsuario) ON DELETE SET NULL,
  mensaje TEXT,
  respuesta TEXT,
  categoria VARCHAR(50),
  fecha TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- ESTADÍSTICAS DEL CHATBOT
-- ===========================================
CREATE TABLE EstadisticaUso (
  idEstadistica INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  categoria VARCHAR(50),
  valor INT,
  fecha TIMESTAMP DEFAULT NOW()
);
