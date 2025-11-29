
-- =================================================================================================
-- SCRIPT DE REINICIO Y POBLADO DE BASE DE DATOS - COLEGIO REALISTA
-- =================================================================================================

-- 1. LIMPIEZA DE TABLAS (Orden correcto para respetar FKs)
TRUNCATE TABLE entregatarea CASCADE;
TRUNCATE TABLE tarea CASCADE;
TRUNCATE TABLE estadisticauso CASCADE;
TRUNCATE TABLE interaccion CASCADE;
TRUNCATE TABLE solicitudtramite CASCADE;
TRUNCATE TABLE tramite CASCADE;
TRUNCATE TABLE preguntafrecuente CASCADE;
TRUNCATE TABLE recurso CASCADE;
TRUNCATE TABLE comunicado CASCADE;
TRUNCATE TABLE evento CASCADE;
TRUNCATE TABLE nota CASCADE;
TRUNCATE TABLE evaluacion CASCADE;
TRUNCATE TABLE asistencia CASCADE;
TRUNCATE TABLE horario CASCADE;
TRUNCATE TABLE docenteasignaturagrupo CASCADE;
TRUNCATE TABLE matricula CASCADE;
TRUNCATE TABLE padreestudiante CASCADE;
TRUNCATE TABLE grupo CASCADE;
TRUNCATE TABLE grado CASCADE;
TRUNCATE TABLE asignatura CASCADE;
TRUNCATE TABLE usuario CASCADE;
TRUNCATE TABLE rol CASCADE;
TRUNCATE TABLE institucion CASCADE;

-- Reiniciar secuencias (opcional pero recomendado)
ALTER SEQUENCE IF EXISTS institucion_idinstitucion_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS rol_idrol_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS usuario_idusuario_seq RESTART WITH 1;
-- ... (otras secuencias se reinician implícitamente con TRUNCATE o se pueden forzar si es necesario)

-- ASEGURAR QUE LA COLUMNA PERIODO EXISTA
ALTER TABLE evaluacion ADD COLUMN IF NOT EXISTS periodo INT;
ALTER TABLE tarea ADD COLUMN IF NOT EXISTS periodo INT;

-- 2. INSERCIÓN DE DATOS BÁSICOS

-- Roles
INSERT INTO rol (nombre) VALUES 
('Administrador'), -- 1
('Rector'),        -- 2
('Docente'),       -- 3
('Estudiante'),    -- 4
('Padre'),         -- 5
('Secretaría');    -- 6

-- Institución (Solo una)
INSERT INTO institucion (nombre, direccion, telefono, correo, tipo, calendario, departamento, ciudad)
VALUES ('Institución Educativa Modelo', 'Calle 123 # 45-67', '6012345678', 'contacto@iemodelo.edu.co', 'Pública', 'A', 'Cundinamarca', 'Bogotá');

-- Trámites
INSERT INTO tramite (nombre, descripcion) VALUES 
('Certificado de Estudios', 'Documento que certifica los años cursados.'),
('Constancia de Matrícula', 'Documento que certifica que el estudiante está activo.'),
('Boletín de Notas', 'Reporte de calificaciones del periodo.');

-- Preguntas Frecuentes
INSERT INTO preguntafrecuente (categoria, pregunta, respuesta) VALUES 
('General', '¿Cuál es el horario de atención?', 'Lunes a Viernes de 7:00 AM a 3:00 PM.'),
('Admisiones', '¿Cuándo inician las matrículas?', 'Las matrículas inician el 1 de diciembre.'),
('Plataforma', '¿Cómo recupero mi contraseña?', 'Contacte a secretaría para restablecer su acceso.');

-- Asignaturas
INSERT INTO asignatura (nombre) VALUES 
('Biología'), ('Ecología'), ('Matemáticas'), ('Física'), ('Química'), 
('Arte'), ('Cultura'), ('Tecnología'), ('Lengua'), ('Literatura'), 
('Derecho'), ('Filosofía'), ('Geografía'), ('Historia'), ('Inglés');

-- Grados (6to a 11ce)
INSERT INTO grado (nombre) VALUES 
('Sexto'), ('Séptimo'), ('Octavo'), ('Noveno'), ('Décimo'), ('Undécimo');

-- 3. GENERACIÓN DE USUARIOS Y ESTRUCTURA ACADÉMICA (Lógica compleja)

DO $$
DECLARE
    v_inst_id INT;
    v_rector_id INT;
    v_docente_id INT;
    v_padre_id INT;
    v_estudiante_id INT;
    v_grado_id INT;
    v_grupo_id INT;
    v_asig_id INT;
    v_dag_id INT;
    v_matricula_id INT;
    v_eval_id INT;
    v_tarea_id INT;
    
    -- Contadores y auxiliares
    i INT;
    j INT;
    k INT;
    p INT; -- Variable para periodos
    curr_grado RECORD;
    curr_asig RECORD;
    curr_docente RECORD;
    
    -- Arrays para nombres aleatorios
    nombres TEXT[] := ARRAY['Juan', 'Maria', 'Carlos', 'Ana', 'Luis', 'Sofia', 'Pedro', 'Lucia', 'Diego', 'Valentina', 'Andres', 'Camila', 'Jose', 'Isabella', 'Miguel', 'Mariana'];
    apellidos TEXT[] := ARRAY['Rodriguez', 'Gomez', 'Martinez', 'Lopez', 'Garcia', 'Hernandez', 'Ramirez', 'Torres', 'Diaz', 'Vargas', 'Castillo', 'Rojas'];
    
    -- Variables para hermanos
    v_apellido_familia TEXT;
    v_padre_nombre TEXT;
    
BEGIN
    SELECT idinstitucion INTO v_inst_id FROM institucion LIMIT 1;

    -- 3.1 Crear Rector
    INSERT INTO usuario (idinstitucion, idrol, nombre, apellido, correo, contrasena_hash, activo)
    VALUES (v_inst_id, 2, 'Roberto', 'Gomez', 'rector@iemodelo.edu.co', 'hash_password', TRUE)
    RETURNING idusuario INTO v_rector_id;

    -- 3.2 Crear Docentes (15 docentes, uno para cada materia o repartidos)
    FOR i IN 1..15 LOOP
        INSERT INTO usuario (idinstitucion, idrol, nombre, apellido, correo, contrasena_hash, activo)
        VALUES (
            v_inst_id, 
            3, 
            nombres[1 + (i % array_length(nombres, 1))], 
            apellidos[1 + (i % array_length(apellidos, 1))], 
            'docente' || i || '@iemodelo.edu.co', 
            'hash_password', 
            TRUE
        );
    END LOOP;

    -- 3.3 Crear Grupos y Estudiantes
    -- Recorrer grados
    FOR curr_grado IN SELECT * FROM grado ORDER BY idgrado LOOP
        
        -- Determinar cuántos grupos para este grado (Sexto y Decimo tienen 2, otros 1 para variar)
        DECLARE
            num_grupos INT := 1;
        BEGIN
            IF curr_grado.nombre IN ('Sexto', 'Décimo') THEN
                num_grupos := 2;
            END IF;

            FOR j IN 1..num_grupos LOOP
                -- Crear Grupo (Ej: 601, 602...)
                INSERT INTO grupo (idgrado, nombre)
                VALUES (curr_grado.idgrado, curr_grado.nombre || ' - Grupo ' || j)
                RETURNING idgrupo INTO v_grupo_id;

                -- Asignar Carga Académica (Docentes a Grupo)
                -- Asignamos todas las materias al grupo, rotando docentes
                FOR curr_asig IN SELECT * FROM asignatura LOOP
                    -- Seleccionar un docente aleatorio (o secuencial)
                    SELECT idusuario INTO v_docente_id FROM usuario WHERE idrol = 3 ORDER BY RANDOM() LIMIT 1;
                    
                    INSERT INTO docenteasignaturagrupo (iddocente, idasignatura, idgrupo)
                    VALUES (v_docente_id, curr_asig.idasignatura, v_grupo_id)
                    RETURNING iddag INTO v_dag_id;

                    -- Crear Horario (Simplificado: 4 clases a la semana por materia es mucho, vamos a poner 1 o 2 bloques)
                    -- Repartir 6 horas al día * 5 días = 30 horas semanales. 15 materias = 2 horas semanales por materia aprox.
                    INSERT INTO horario (iddag, diasemana, horainicio, horafin)
                    VALUES 
                    (v_dag_id, (ARRAY['Lunes','Martes','Miércoles','Jueves','Viernes'])[1 + (curr_asig.idasignatura % 5)], '08:00', '10:00');

                    -- Crear Evaluaciones y Tareas para este grupo/materia
                    -- Generar 4 periodos
                    FOR p IN 1..4 LOOP
                        -- Evaluación (Examen) por periodo
                        INSERT INTO evaluacion (iddag, titulo, descripcion, fecha, tipo, periodo)
                        VALUES (
                            v_dag_id, 
                            'Parcial Periodo ' || p || ' - ' || curr_asig.nombre, 
                            'Evaluación de conocimientos del periodo ' || p, 
                            CASE 
                                WHEN p = 1 THEN '2025-03-15'::DATE
                                WHEN p = 2 THEN '2025-05-15'::DATE
                                WHEN p = 3 THEN '2025-08-15'::DATE
                                WHEN p = 4 THEN '2025-10-15'::DATE
                            END, 
                            'Examen',
                            p
                        )
                        RETURNING idevaluacion INTO v_eval_id;

                        -- Tarea (Taller) por periodo
                        INSERT INTO tarea (iddag, titulo, descripcion, fechaasignacion, fechaentrega, tipo, periodo)
                        VALUES (
                            v_dag_id, 
                            'Taller Periodo ' || p || ' - ' || curr_asig.nombre, 
                            'Ejercicios prácticos del periodo ' || p, 
                            CASE 
                                WHEN p = 1 THEN '2025-02-15'::DATE
                                WHEN p = 2 THEN '2025-04-15'::DATE
                                WHEN p = 3 THEN '2025-07-15'::DATE
                                WHEN p = 4 THEN '2025-09-15'::DATE
                            END,
                            CASE 
                                WHEN p = 1 THEN '2025-02-28'::DATE
                                WHEN p = 2 THEN '2025-04-30'::DATE
                                WHEN p = 3 THEN '2025-07-30'::DATE
                                WHEN p = 4 THEN '2025-09-30'::DATE
                            END,
                            'Taller',
                            p
                        )
                        RETURNING idtarea INTO v_tarea_id;
                    END LOOP;

                END LOOP;

                -- Crear Estudiantes (10 por grupo)
                -- Para simular hermanos, cada 3 estudiantes creamos un "hermano" en otro grado/grupo si es posible, 
                -- pero para simplificar, vamos a crear familias dinámicamente.
                
                FOR k IN 1..10 LOOP
                    v_apellido_familia := apellidos[1 + (k % array_length(apellidos, 1))];
                    
                    -- Crear Estudiante
                    INSERT INTO usuario (idinstitucion, idrol, nombre, apellido, correo, contrasena_hash, activo, tipodocumento, documento)
                    VALUES (
                        v_inst_id, 
                        4, 
                        nombres[1 + (floor(random() * array_length(nombres, 1)))::int], 
                        v_apellido_familia, 
                        'estudiante_' || curr_grado.idgrado || '_' || j || '_' || k || '@iemodelo.edu.co', 
                        'hash_password', 
                        TRUE,
                        'TI',
                        '1000' || curr_grado.idgrado || j || k
                    )
                    RETURNING idusuario INTO v_estudiante_id;

                    -- Matricular
                    INSERT INTO matricula (idestudiante, idgrupo, anio)
                    VALUES (v_estudiante_id, v_grupo_id, 2025)
                    RETURNING idmatricula INTO v_matricula_id;

                    -- Generar Notas y Asistencia
                    -- Notas para las evaluaciones creadas arriba (necesitamos iterar DAGs del grupo)
                    FOR v_dag_id IN SELECT iddag FROM docenteasignaturagrupo WHERE idgrupo = v_grupo_id LOOP
                        -- Buscar evaluaciones de este DAG
                        FOR v_eval_id IN SELECT idevaluacion FROM evaluacion WHERE iddag = v_dag_id LOOP
                            -- Generar nota aleatoria: 80% probabilidad de aprobar (3.0-5.0), 20% de reprobar (1.0-2.9)
                            INSERT INTO nota (idevaluacion, idmatricula, nota)
                            VALUES (
                                v_eval_id, 
                                v_matricula_id, 
                                CASE 
                                    WHEN random() < 0.8 THEN (3.0 + random() * 2.0)::numeric(4,2) -- Aprueba
                                    ELSE (1.0 + random() * 1.9)::numeric(4,2) -- Reprueba
                                END
                            );
                        END LOOP;
                        
                        -- Entregas de tareas
                         FOR v_tarea_id IN SELECT idtarea FROM tarea WHERE iddag = v_dag_id LOOP
                            INSERT INTO entregatarea (idtarea, idmatricula, fechaentrega, estado, nota)
                            VALUES (
                                v_tarea_id, 
                                v_matricula_id, 
                                NOW(), 
                                'calificada', 
                                CASE 
                                    WHEN random() < 0.85 THEN (3.0 + random() * 2.0)::numeric(3,1) -- Aprueba
                                    ELSE (1.0 + random() * 1.9)::numeric(3,1) -- Reprueba
                                END
                            );
                        END LOOP;
                    END LOOP;

                    -- Asistencia (Unos días aleatorios)
                    INSERT INTO asistencia (idmatricula, fecha, estado) VALUES (v_matricula_id, NOW() - INTERVAL '1 day', 'Presente');
                    INSERT INTO asistencia (idmatricula, fecha, estado) VALUES (v_matricula_id, NOW() - INTERVAL '2 days', 'Presente');
                    INSERT INTO asistencia (idmatricula, fecha, estado) VALUES (v_matricula_id, NOW() - INTERVAL '3 days', CASE WHEN random() > 0.9 THEN 'Ausente' ELSE 'Presente' END);

                    -- Asignar Padre (Hermanos)
                    -- Lógica: Si el apellido coincide con el anterior (simulado), usamos el mismo padre.
                    -- Para garantizar hermanos, vamos a forzar que los estudiantes 1 y 2 de cada grupo sean hermanos de los del grupo anterior si existen.
                    -- Simplificación: Crear un padre para cada estudiante, PERO si k=1 y j=1 y grado>1, intentar buscar padre del grado anterior.
                    -- Mejor: Crear padre siempre, y luego manualmente unificar algunos.
                    
                    -- Vamos a crear un padre para este estudiante
                    INSERT INTO usuario (idinstitucion, idrol, nombre, apellido, correo, contrasena_hash, activo)
                    VALUES (
                        v_inst_id, 
                        5, 
                        nombres[1 + (floor(random() * array_length(nombres, 1)))::int], 
                        v_apellido_familia, 
                        'padre_' || curr_grado.idgrado || '_' || j || '_' || k || '@iemodelo.edu.co', 
                        'hash_password', 
                        TRUE
                    )
                    RETURNING idusuario INTO v_padre_id;

                    INSERT INTO padreestudiante (idpadre, idestudiante, relacion)
                    VALUES (v_padre_id, v_estudiante_id, 'Padre/Madre');

                END LOOP;
            END LOOP;
        END;
    END LOOP;

    -- 4. CREAR HERMANOS (Relacionar estudiantes existentes con un solo padre)
    -- Tomamos al padre del estudiante 1 del grado 6 y le asignamos también al estudiante 1 del grado 7, 8, etc.
    DECLARE
        v_padre_multi_id INT;
        v_hijo_extra_id INT;
    BEGIN
        -- Obtener un padre existente (del primer estudiante de sexto)
        SELECT idpadre INTO v_padre_multi_id 
        FROM padreestudiante 
        WHERE idestudiante IN (SELECT idusuario FROM usuario WHERE correo LIKE 'estudiante_1_%') -- Grado 1 (Sexto es id 1 en insercion)
        LIMIT 1;

        IF v_padre_multi_id IS NOT NULL THEN
            -- Asignarle hijos de otros grados (ej: estudiante 1 de septimo, octavo)
            FOR i IN 2..4 LOOP -- Grados 2, 3, 4
                SELECT idusuario INTO v_hijo_extra_id 
                FROM usuario 
                WHERE correo LIKE 'estudiante_' || i || '_1_1%' -- Estudiante 1 del grupo 1 del grado i
                LIMIT 1;
                
                IF v_hijo_extra_id IS NOT NULL THEN
                    -- Borrar relación anterior de ese hijo (si tenía padre creado por defecto)
                    DELETE FROM padreestudiante WHERE idestudiante = v_hijo_extra_id;
                    -- Asignar al padre multi
                    INSERT INTO padreestudiante (idpadre, idestudiante, relacion)
                    VALUES (v_padre_multi_id, v_hijo_extra_id, 'Padre/Madre');
                    
                    -- Actualizar apellido del hijo para que coincida
                    UPDATE usuario SET apellido = (SELECT apellido FROM usuario WHERE idusuario = v_padre_multi_id) WHERE idusuario = v_hijo_extra_id;
                END IF;
            END LOOP;
            
            -- Actualizar nombre del padre para identificarlo
            UPDATE usuario SET nombre = 'Ricardo' WHERE idusuario = v_padre_multi_id;
        END IF;
    END;

    -- 5. EVENTOS Y COMUNICADOS
    INSERT INTO evento (idinstitucion, titulo, descripcion, fechainicio, fechafin, tipo) VALUES
    (v_inst_id, 'Día de la Ciencia', 'Exposición de proyectos científicos', '2025-05-15 08:00:00', '2025-05-15 14:00:00', 'Académico'),
    (v_inst_id, 'Entrega de Boletines', 'Reunión de padres para entrega de notas', '2025-04-10 07:00:00', '2025-04-10 12:00:00', 'Reunión'),
    (v_inst_id, 'Día Deportivo', 'Jornada de deportes intercursos', '2025-06-20 08:00:00', '2025-06-20 16:00:00', 'Deportivo');

    INSERT INTO comunicado (idinstitucion, titulo, mensaje, dirigidoa) VALUES
    (v_inst_id, 'Inicio de Clases', 'Bienvenidos al año escolar 2025. Iniciamos labores el 1 de febrero.', 'General'),
    (v_inst_id, 'Uniforme Escolar', 'Recordamos el uso correcto del uniforme de diario.', 'Estudiantes');

END $$;
