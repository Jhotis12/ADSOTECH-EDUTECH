import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkygbdtvtdhytkhficyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreWdiZHR2dGRoeXRraGZpY3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDg1OTEsImV4cCI6MjA3OTcyNDU5MX0.I4g9iRXnNmnrQXdH3KesfcwUdYWk5zo2t1iKauCXNkA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
    console.log('Checking events in database...\n');

    // Get all events
    const { data: allEvents, error } = await supabase
        .from('evento')
        .select('*')
        .order('fechainicio', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        return;
    }

    console.log(`Total events in database: ${allEvents?.length || 0}\n`);

    if (allEvents && allEvents.length > 0) {
        allEvents.forEach((event, index) => {
            console.log(`Event ${index + 1}:`);
            console.log(`  ID: ${event.idevento}`);
            console.log(`  Título: ${event.titulo}`);
            console.log(`  Descripción: ${event.descripcion}`);
            console.log(`  Tipo: ${event.tipo}`);
            console.log(`  Fecha Inicio: ${event.fechainicio}`);
            console.log(`  Fecha Fin: ${event.fechafin}`);
            console.log(`  Institución ID: ${event.idinstitucion}`);
            console.log('---');
        });

        // Check future events
        const now = new Date().toISOString();
        const futureEvents = allEvents.filter(e => e.fechafin >= now);
        console.log(`\nFuture/ongoing events: ${futureEvents.length}`);

        if (futureEvents.length > 0) {
            console.log('\nFuture events:');
            futureEvents.forEach((event, index) => {
                console.log(`${index + 1}. ${event.titulo} - ${event.tipo}`);
                console.log(`   ${event.fechainicio} to ${event.fechafin}`);
            });
        }
    } else {
        console.log('No events found in database.');
    }

    // Check institutions
    const { data: institutions } = await supabase
        .from('institucion')
        .select('idinstitucion, nombre');

    console.log('\n\nInstitutions in database:');
    institutions?.forEach(inst => {
        console.log(`  ID ${inst.idinstitucion}: ${inst.nombre}`);
    });
}

checkEvents();
