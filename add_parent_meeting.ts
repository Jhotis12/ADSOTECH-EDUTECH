import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkygbdtvtdhytkhficyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreWdiZHR2dGRoeXRraGZpY3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDg1OTEsImV4cCI6MjA3OTcyNDU5MX0.I4g9iRXnNmnrQXdH3KesfcwUdYWk5zo2t1iKauCXNkA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function addParentMeeting() {
    console.log('Adding parent meeting event...\n');

    // Create a future date for the meeting (next month)
    const meetingDate = new Date();
    meetingDate.setMonth(meetingDate.getMonth() + 1);
    meetingDate.setDate(15); // Day 15 of next month
    meetingDate.setHours(18, 0, 0, 0); // 6:00 PM

    const meetingEnd = new Date(meetingDate);
    meetingEnd.setHours(20, 0, 0, 0); // 8:00 PM

    const { data, error } = await supabase
        .from('evento')
        .insert({
            idinstitucion: 1,
            titulo: 'Reunión de Padres de Familia',
            descripcion: 'Reunión general de padres para discutir el progreso académico y actividades del próximo periodo',
            fechainicio: meetingDate.toISOString(),
            fechafin: meetingEnd.toISOString(),
            tipo: 'Reunión'
        })
        .select();

    if (error) {
        console.error('Error adding event:', error);
    } else {
        console.log('Event added successfully!');
        console.log('Details:');
        console.log(`  Título: ${data[0].titulo}`);
        console.log(`  Fecha: ${meetingDate.toLocaleString('es-CO')}`);
        console.log(`  Tipo: ${data[0].tipo}`);
    }

    // Verify all future events now
    const { data: futureEvents } = await supabase
        .from('evento')
        .select('*')
        .eq('idinstitucion', 1)
        .gte('fechafin', new Date().toISOString())
        .order('fechainicio', { ascending: true });

    console.log(`\n\nTotal future events for institution 1: ${futureEvents?.length || 0}`);
    if (futureEvents && futureEvents.length > 0) {
        futureEvents.forEach((event, index) => {
            console.log(`\n${index + 1}. ${event.titulo}`);
            console.log(`   Tipo: ${event.tipo}`);
            console.log(`   Inicio: ${new Date(event.fechainicio).toLocaleString('es-CO')}`);
            console.log(`   Fin: ${new Date(event.fechafin).toLocaleString('es-CO')}`);
        });
    }
}

addParentMeeting();
