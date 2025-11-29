INSERT INTO institucion (nombre, direccion, telefono, correo, tipo, calendario, departamento, ciudad) VALUES
('Colegio Moderno ABC', 'Calle Falsa 123, Ciudad Nueva', '555-1234', 'info@colegioabc.edu', 'Educación Primaria y Secundaria', 'Calendario A', 'Cundinamarca', 'Bogotá'),
('Liceo Bilingüe XYZ', 'Avenida Siempre Viva 456, El Poblado', '555-5678', 'contacto@liceoxyz.edu', 'Educación Preescolar y Primaria', 'Calendario B', 'Antioquia', 'Medellín');

INSERT INTO rol (nombre) VALUES
('Administrador'),
('Docente'),
('Estudiante'),
('Acudiente');

INSERT INTO usuario (idinstitucion, idrol, nombre, apellido, tipodocumento, documento, correo, telefono, genero, contrasena_hash, activo) VALUES
-- Administradores (idrol = 1)
(1, 1, 'Ana', 'Gómez', 'CC', '100000001', 'ana.gomez@colegioabc.edu', '3101112233', 'Femenino', 'hashed_password_admin1', TRUE),
(1, 1, 'Luis', 'Pérez', 'CC', '100000002', 'luis.perez@colegioabc.edu', '3101112244', 'Masculino', 'hashed_password_admin2', TRUE),

-- Docentes (idrol = 2)
(1, 2, 'María', 'Rodríguez', 'CC', '100000003', 'maria.rodriguez@colegioabc.edu', '3112223344', 'Femenino', 'hashed_password_docente1', TRUE),
(1, 2, 'Carlos', 'López', 'CC', '100000004', 'carlos.lopez@colegioabc.edu', '3112223355', 'Masculino', 'hashed_password_docente2', TRUE),
(1, 2, 'Laura', 'Martínez', 'CC', '100000005', 'laura.martinez@colegioabc.edu', '3112223366', 'Femenino', 'hashed_password_docente3', TRUE),

-- Estudiantes (idrol = 3)
(1, 3, 'Sofía', 'Ramírez', 'TI', '100000006', 'sofia.ramirez@colegioabc.edu', '3123334455', 'Femenino', 'hashed_password_estudiante1', TRUE),
(1, 3, 'Diego', 'García', 'TI', '100000007', 'diego.garcia@colegioabc.edu', '3123334466', 'Masculino', 'hashed_password_estudiante2', TRUE),
(1, 3, 'Valeria', 'Hernández', 'TI', '100000008', 'valeria.hernandez@colegioabc.edu', '3123334477', 'Femenino', 'hashed_password_estudiante3', TRUE),
(1, 3, 'Juan', 'Diaz', 'TI', '100000009', 'juan.diaz@colegioabc.edu', '3123334488', 'Masculino', 'hashed_password_estudiante4', TRUE),
(1, 3, 'Camila', 'Torres', 'TI', '100000010', 'camila.torres@colegioabc.edu', '3123334499', 'Femenino', 'hashed_password_estudiante5', TRUE),

-- Acudientes (idrol = 4)
(1, 4, 'Roberto', 'Ramírez', 'CC', '100000011', 'roberto.ramirez@mail.com', '3134445566', 'Masculino', 'hashed_password_acudiente1', TRUE),
(1, 4, 'Patricia', 'García', 'CC', '100000012', 'patricia.garcia@mail.com', '3134445577', 'Femenino', 'hashed_password_acudiente2', TRUE);

INSERT INTO grado (nombre) VALUES
('Primero'),
('Segundo'),
('Tercero'),
('Cuarto'),
('Quinto'),
('Sexto'),
('Séptimo'),
('Octavo'),
('Noveno'),
('Décimo'),
('Once');

INSERT INTO grupo (idgrado, nombre) VALUES
(1, '101'),
(1, '102'),
(6, '601'),
(6, '602'),
(10, '1001'),
(10, '1002');

INSERT INTO matricula (idestudiante, idgrupo, anio, fecha) VALUES
(6, 1, 2023, NOW()),
(7, 1, 2023, NOW()),
(8, 3, 2023, NOW()),
(9, 3, 2023, NOW()),
(10, 5, 2023, NOW());

INSERT INTO asignatura (nombre) VALUES
('Matemáticas'),
('Lenguaje'),
('Ciencias Naturales'),
('Ciencias Sociales'),
('Inglés'),
('Educación Física'),
('Física'),
('Química');

INSERT INTO docenteasignaturagrupo (iddocente, idasignatura, idgrupo) VALUES
(3, 1, 1), -- María Rodríguez - Matemáticas - 101
(3, 1, 3), -- María Rodríguez - Matemáticas - 601
(4, 2, 1), -- Carlos López - Lenguaje - 101
(4, 4, 3), -- Carlos López - Ciencias Sociales - 601
(5, 7, 5); -- Laura Martínez - Física - 1001

INSERT INTO padreestudiante (idpadre, idestudiante, relacion) VALUES
(11, 6, 'Padre'),
(12, 7, 'Madre');

INSERT INTO horario (iddag, diasemana, horainicio, horafin) VALUES
(1, 'Lunes', '08:00:00', '09:00:00'),
(1, 'Miércoles', '08:00:00', '09:00:00'),
(3, 'Martes', '09:00:00', '10:00:00'),
(3, 'Jueves', '09:00:00', '10:00:00'),
(5, 'Lunes', '10:00:00', '12:00:00'),
(5, 'Miércoles', '10:00:00', '12:00:00');

INSERT INTO evento (idinstitucion, titulo, descripcion, fechainicio, fechafin, tipo) VALUES
(1, 'Día de la Ciencia', 'Exposición de proyectos científicos de los estudiantes.', '2023-10-26 08:00:00', '2023-10-26 17:00:00', 'Académico'),
(1, 'Reunión de Padres', 'Reunión informativa sobre el progreso académico.', '2023-11-15 18:00:00', '2023-11-15 20:00:00', 'Administrativo'),
(1, 'Festival Deportivo', 'Competencias deportivas entre grados.', '2023-12-01 07:00:00', '2023-12-02 16:00:00', 'Deportivo');

INSERT INTO comunicado (idinstitucion, titulo, mensaje, dirigidoa) VALUES
(1, 'Apertura de inscripciones para actividades extracurriculares', 'Estimados estudiantes y padres de familia, les informamos que las inscripciones para las actividades extracurriculares del próximo semestre ya están abiertas. Pueden consultar la oferta completa en el portal estudiantil.', 'Estudiantes y Acudientes'),
(1, 'Cambio de horario - Día del Maestro', 'Se informa a toda la comunidad educativa que el próximo 20 de octubre no habrá clases debido a la celebración del Día del Maestro. Agradecemos su comprensión.', 'Todos'),
(1, 'Recordatorio: Uso del uniforme', 'Se recuerda a todos los estudiantes la importancia de asistir al colegio con el uniforme completo y en buen estado. Esto contribuye a mantener la disciplina y la imagen de nuestra institución.', 'Estudiantes');

INSERT INTO recurso (idgrado, idasignatura, titulo, tipo, url) VALUES
(1, 1, 'Guía de Matemáticas Básicas', 'PDF', 'http://ejemplo.com/guiamatematicas1.pdf'),
(6, 2, 'Ejercicios de Comprensión Lectora', 'Documento', 'http://ejemplo.com/comprensionlectora6.docx'),
(10, 7, 'Introducción a la Mecánica Clásica', 'Video', 'http://ejemplo.com/fisicamecanica10.mp4');

INSERT INTO preguntafrecuente (categoria, pregunta, respuesta) VALUES
('Admisiones', '¿Cuáles son los requisitos para la matrícula?', 'Los requisitos incluyen copia del registro civil, boletín del año anterior, y formulario de inscripción diligenciado.'),
('Académico', '¿Cómo puedo consultar las notas de mi hijo?', 'Las notas se pueden consultar a través del portal estudiantil, ingresando con las credenciales de acudiente.'),
('Servicios', '¿Hay servicio de transporte escolar?', 'Sí, ofrecemos servicio de transporte escolar con rutas establecidas. Para más información, contactar la secretaría.');

INSERT INTO tramite (nombre, descripcion) VALUES
('Solicitud de Certificado de Notas', 'Documento oficial con el historial académico del estudiante.'),
('Retiro de Estudiante', 'Proceso para dar de baja a un estudiante de la institución.'),
('Solicitud de Cupo', 'Proceso para solicitar un cupo para un nuevo estudiante.');

INSERT INTO solicitudtramite (idusuario, idtramite, fecha, estado, observacion) VALUES
(11, 1, NOW(), 'Pendiente', 'Se requiere certificado para postulación a beca.'),
(12, 2, NOW(), 'Aprobada', 'Traslado a otra ciudad.');

INSERT INTO evaluacion (iddag, titulo, descripcion, fecha, tipo, periodo) VALUES
(1, 'Examen Final Matemáticas', 'Evaluación final del curso de matemáticas para el grado 101.', '2023-11-20', 'Examen', 4),
(3, 'Taller de Escritura Creativa', 'Evaluación de habilidades de escritura y creatividad.', '2023-11-10', 'Taller', 4),
(5, 'Parcial de Física I', 'Primera evaluación parcial del curso de física para el grado 1001.', '2023-10-25', 'Parcial', 3);

INSERT INTO nota (idevaluacion, idmatricula, nota) VALUES
(1, 1, 4.5),
(2, 2, 3.8),
(3, 3, 4.0);

INSERT INTO asistencia (idmatricula, fecha, estado) VALUES
(1, '2023-11-01', 'Presente'),
(2, '2023-11-01', 'Ausente'),
(3, '2023-11-01', 'Presente');

INSERT INTO tarea (iddag, titulo, descripcion, fechaasignacion, fechaentrega, tipo, periodo) VALUES
(1, 'Taller de Álgebra', 'Resolver ejercicios del capítulo 5 del libro de texto.', '2023-11-06', '2023-11-13', 'Trabajo en casa', 4),
(3, 'Ensayo sobre la Novela X', 'Escribir un ensayo crítico sobre la novela leída en clase.', '2023-11-08', '2023-11-22', 'Proyecto', 4);

INSERT INTO entregatarea (idtarea, idmatricula, fechaentrega, estado, nota) VALUES
(1, 1, '2023-11-12', 'Entregada', 4.2),
(2, 2, '2023-11-20', 'Entregada', 3.5);
