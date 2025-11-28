-- ===========================================
-- LIMPIEZA SEGURA (orden correcto sin CASCADE global)
-- ===========================================

DROP TABLE IF EXISTS estadisticauso;
DROP TABLE IF EXISTS interaccion;
DROP TABLE IF EXISTS solicitudtramite;
DROP TABLE IF EXISTS tramite;
DROP TABLE IF EXISTS preguntafrecuente;
DROP TABLE IF EXISTS recurso;
DROP TABLE IF EXISTS comunicado;
DROP TABLE IF EXISTS evento;
DROP TABLE IF EXISTS nota;
DROP TABLE IF EXISTS evaluacion;
DROP TABLE IF EXISTS asistencia;
DROP TABLE IF EXISTS horario;
DROP TABLE IF EXISTS docenteasignaturagrupo;
DROP TABLE IF EXISTS matricula;
DROP TABLE IF EXISTS padreestudiante;
DROP TABLE IF EXISTS grupo;
DROP TABLE IF EXISTS grado;
DROP TABLE IF EXISTS asignatura;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS institucion;

-- ===========================================
-- INSTITUCIONES
-- ===========================================
CREATE TABLE institucion (
  idinstitucion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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
CREATE TABLE rol (
  idrol INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- ===========================================
-- USUARIOS (sin auth.supabase)
-- ===========================================
CREATE TABLE usuario (
  idusuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idinstitucion INT REFERENCES institucion(idinstitucion) ON DELETE SET NULL,
  idrol INT REFERENCES rol(idrol) ON DELETE RESTRICT,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  tipodocumento VARCHAR(25),
  documento VARCHAR(255),
  correo VARCHAR(50) UNIQUE,
  telefono VARCHAR(20),
  genero VARCHAR(20),
  fecharegistro TIMESTAMP DEFAULT NOW(),
  contrasena_hash TEXT NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);

-- ===========================================
-- PADRE - ESTUDIANTE
-- ===========================================
CREATE TABLE padreestudiante (
  idpadre INT REFERENCES usuario(idusuario) ON DELETE CASCADE,
  idestudiante INT REFERENCES usuario(idusuario) ON DELETE CASCADE,
  relacion VARCHAR(50),
  PRIMARY KEY (idpadre, idestudiante)
);

-- ===========================================
-- GRADO
-- ===========================================
CREATE TABLE grado (
  idgrado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50)
);

-- ===========================================
-- GRUPOS
-- ===========================================
CREATE TABLE grupo (
  idgrupo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idgrado INT REFERENCES grado(idgrado) ON DELETE CASCADE,
  nombre VARCHAR(50)
);

-- ===========================================
-- MATRÍCULA
-- ===========================================
CREATE TABLE matricula (
  idmatricula INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idestudiante INT REFERENCES usuario(idusuario) ON DELETE CASCADE,
  idgrupo INT REFERENCES grupo(idgrupo) ON DELETE CASCADE,
  anio INT,
  fecha TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- ASIGNATURAS
-- ===========================================
CREATE TABLE asignatura (
  idasignatura INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(50)
);

-- ===========================================
-- DOCENTE - ASIGNATURA - GRUPO
-- ===========================================
CREATE TABLE docenteasignaturagrupo (
  iddag INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  iddocente INT REFERENCES usuario(idusuario) ON DELETE CASCADE,
  idasignatura INT REFERENCES asignatura(idasignatura) ON DELETE CASCADE,
  idgrupo INT REFERENCES grupo(idgrupo) ON DELETE CASCADE
);

-- ===========================================
-- HORARIOS
-- ===========================================
CREATE TABLE horario (
  idhorario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  iddag INT REFERENCES docenteasignaturagrupo(iddag) ON DELETE CASCADE,
  diasemana VARCHAR(20),
  horainicio TIME,
  horafin TIME
);

-- ===========================================
-- ASISTENCIA
-- ===========================================
CREATE TABLE asistencia (
  idasistencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idmatricula INT REFERENCES matricula(idmatricula) ON DELETE CASCADE,
  fecha DATE,
  estado VARCHAR(20)
);

-- ===========================================
-- EVALUACIONES
-- ===========================================
CREATE TABLE evaluacion (
  idevaluacion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  iddag INT REFERENCES docenteasignaturagrupo(iddag) ON DELETE CASCADE,
  titulo VARCHAR(100),
  descripcion VARCHAR(255),
  fecha DATE,
  tipo VARCHAR(50)
);

CREATE TABLE nota (
  idnota INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idevaluacion INT REFERENCES evaluacion(idevaluacion) ON DELETE CASCADE,
  idmatricula INT REFERENCES matricula(idmatricula) ON DELETE CASCADE,
  nota NUMERIC(4,2)
);

-- ===========================================
-- EVENTOS
-- ===========================================
CREATE TABLE evento (
  idevento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idinstitucion INT REFERENCES institucion(idinstitucion) ON DELETE CASCADE,
  titulo VARCHAR(100),
  descripcion VARCHAR(255),
  fechainicio TIMESTAMP,
  fechafin TIMESTAMP,
  tipo VARCHAR(50)
);

-- ===========================================
-- COMUNICADOS
-- ===========================================
CREATE TABLE comunicado (
  idcomunicado INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idinstitucion INT REFERENCES institucion(idinstitucion) ON DELETE CASCADE,
  titulo VARCHAR(100),
  mensaje TEXT,
  fecha TIMESTAMP DEFAULT NOW(),
  dirigidoa VARCHAR(50)
);

-- ===========================================
-- RECURSOS EDUCATIVOS
-- ===========================================
CREATE TABLE recurso (
  idrecurso INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idgrado INT REFERENCES grado(idgrado) ON DELETE SET NULL,
  idasignatura INT REFERENCES asignatura(idasignatura) ON DELETE SET NULL,
  titulo VARCHAR(100),
  tipo VARCHAR(50),
  url VARCHAR(255)
);

-- ===========================================
-- PREGUNTAS FRECUENTES
-- ===========================================
CREATE TABLE preguntafrecuente (
  idpregunta INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  categoria VARCHAR(50),
  pregunta VARCHAR(255),
  respuesta TEXT
);

-- ===========================================
-- TRÁMITES
-- ===========================================
CREATE TABLE tramite (
  idtramite INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion VARCHAR(255)
);

CREATE TABLE solicitudtramite (
  idsolicitud INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idusuario INT REFERENCES usuario(idusuario) ON DELETE CASCADE,
  idtramite INT REFERENCES tramite(idtramite) ON DELETE CASCADE,
  fecha TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(50),
  observacion VARCHAR(255)
);

-- ===========================================
-- CHATBOT - INTERACCIONES
-- ===========================================
CREATE TABLE interaccion (
  idinteraccion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idusuario INT REFERENCES usuario(idusuario) ON DELETE SET NULL,
  mensaje TEXT,
  respuesta TEXT,
  categoria VARCHAR(50),
  fecha TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- ESTADISTICAS USO
-- ===========================================
CREATE TABLE estadisticauso (
  idestadistica INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  categoria VARCHAR(50),
  valor INT,
  fecha TIMESTAMP DEFAULT NOW()
);
-- ============================
-- tareas
-- ============================
create table tarea (
    idtarea serial primary key,
    iddag int not null, -- docenteasignaturagrupo
    titulo varchar(100) not null,
    descripcion text,
    fechaasignacion date not null,
    fechaentrega date not null,
    tipo varchar(50) -- ej: "trabajo en casa", "proyecto"
);

-- ============================
-- entregas de tareas
-- ============================
create table entregatarea (
    identrega serial primary key,
    idtarea int not null,
    idmatricula int not null,
    fechaentrega date,
    estado varchar(50), -- ej: "pendiente", "entregada", "calificada"
    nota decimal(3,1) -- opcional, si se califica
);