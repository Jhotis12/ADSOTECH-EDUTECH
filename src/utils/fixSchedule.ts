import { supabase } from '../lib/supabase';

export const fixScheduleData = async () => {
    try {
        console.log('Starting schedule fix...');

        // 1. Fetch all schedules with their group info
        const { data: schedules, error } = await supabase
            .from('horario')
            .select(`
                idhorario,
                iddag,
                docenteasignaturagrupo:iddag (
                    idgrupo
                )
            `);

        if (error) throw error;
        if (!schedules || schedules.length === 0) {
            console.log('No schedules found to fix.');
            return;
        }

        // 2. Group schedules by idgrupo
        const schedulesByGroup: { [key: number]: any[] } = {};

        schedules.forEach((s: any) => {
            const groupId = s.docenteasignaturagrupo?.idgrupo;
            if (groupId) {
                if (!schedulesByGroup[groupId]) {
                    schedulesByGroup[groupId] = [];
                }
                schedulesByGroup[groupId].push(s);
            }
        });

        // 3. Define available slots
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        const timeSlots = [
            { start: '08:00:00', end: '10:00:00' },
            { start: '10:00:00', end: '12:00:00' },
            { start: '14:00:00', end: '16:00:00' }
        ];

        // 4. Distribute schedules for each group
        for (const groupId in schedulesByGroup) {
            const groupSchedules = schedulesByGroup[groupId];
            let dayIndex = 0;
            let slotIndex = 0;

            for (const schedule of groupSchedules) {
                // Assign current slot
                const day = days[dayIndex];
                const slot = timeSlots[slotIndex];

                // Update the schedule in the database
                const { error: updateError } = await supabase
                    .from('horario')
                    .update({
                        diasemana: day,
                        horainicio: slot.start,
                        horafin: slot.end
                    })
                    .eq('idhorario', schedule.idhorario);

                if (updateError) {
                    console.error(`Failed to update schedule ${schedule.idhorario}:`, updateError);
                } else {
                    console.log(`Updated schedule ${schedule.idhorario} to ${day} ${slot.start}`);
                }

                // Move to next slot
                slotIndex++;
                if (slotIndex >= timeSlots.length) {
                    slotIndex = 0;
                    dayIndex++;
                    if (dayIndex >= days.length) {
                        dayIndex = 0; // Wrap around if too many subjects (will overlap, but less likely)
                    }
                }
            }
        }

        console.log('Schedule fix completed!');
        alert('¡Horarios corregidos exitosamente! Por favor recarga la página.');
        window.location.reload();

    } catch (err) {
        console.error('Error fixing schedules:', err);
        alert('Error al corregir horarios. Revisa la consola.');
    }
};
