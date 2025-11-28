-- Insertar tareas de prueba
-- Asumiendo que ya existen datos de prueba para docentes, asignaturas y grupos.
-- Necesitamos saber un iddag válido.

DO $$
DECLARE
    v_iddag INT;
    v_idmatricula INT;
    v_idtarea INT;
BEGIN
    -- Obtener un iddag existente (docente-asignatura-grupo)
    SELECT iddag INTO v_iddag FROM docenteasignaturagrupo LIMIT 1;
    
    -- Obtener una matrícula asociada al grupo de ese iddag
    SELECT m.idmatricula INTO v_idmatricula 
    FROM matricula m
    JOIN docenteasignaturagrupo dag ON m.idgrupo = dag.idgrupo
    WHERE dag.iddag = v_iddag
    LIMIT 1;

    IF v_iddag IS NOT NULL AND v_idmatricula IS NOT NULL THEN
        -- Crear una tarea pendiente
        INSERT INTO tarea (iddag, titulo, descripcion, fechaasignacion, fechaentrega, tipo)
        VALUES (v_iddag, 'Tarea de Prueba 1', 'Resolver los ejercicios 1 al 10 de la página 50.', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'Taller')
        RETURNING idtarea INTO v_idtarea;

        -- Crear una tarea entregada
        INSERT INTO tarea (iddag, titulo, descripcion, fechaasignacion, fechaentrega, tipo)
        VALUES (v_iddag, 'Proyecto Final', 'Entrega del proyecto de investigación.', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '2 days', 'Proyecto');

        -- Registrar entrega para la segunda tarea (buscando el ID recién insertado o asumiendo serial)
        INSERT INTO entregatarea (idtarea, idmatricula, fechaentrega, estado, nota)
        SELECT idtarea, v_idmatricula, CURRENT_DATE - INTERVAL '3 days', 'calificada', 4.5
        FROM tarea 
        WHERE titulo = 'Proyecto Final' AND iddag = v_iddag
        LIMIT 1;
        
        -- Crear una tarea atrasada
        INSERT INTO tarea (iddag, titulo, descripcion, fechaasignacion, fechaentrega, tipo)
        VALUES (v_iddag, 'Quiz Rápido', 'Quiz sobre temas vistos en clase.', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '1 day', 'Quiz');

    END IF;
END $$;
