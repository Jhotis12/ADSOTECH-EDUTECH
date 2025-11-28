import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkygbdtvtdhytkhficyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreWdiZHR2dGRoeXRraGZpY3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDg1OTEsImV4cCI6MjA3OTcyNDU5MX0.I4g9iRXnNmnrQXdH3KesfcwUdYWk5zo2t1iKauCXNkA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateUserLogin() {
    console.log('Simulating user login and data loading...\n');

    // Get a parent user
    const { data: users } = await supabase
        .from('usuario')
        .select('*')
        .eq('idrol', 5)
        .limit(1);

    if (!users || users.length === 0) {
        console.log('No parent user found');
        return;
    }

    const user = users[0];
    console.log(`User: ${user.nombre} ${user.apellido}`);
    console.log(`Institution ID: ${user.idinstitucion}\n`);

    // Simulate the exact query from StudentDashboard.tsx
    const { data: eventsData, error } = await supabase
        .from('evento')
        .select('*')
        .eq('idinstitucion', user.idinstitucion)
        .gte('fechafin', new Date().toISOString())
        .order('fechainicio', { ascending: true });

    if (error) {
        console.error('Error loading events:', error);
        return;
    }

    console.log(`Events loaded: ${eventsData?.length || 0}\n`);

    if (eventsData && eventsData.length > 0) {
        console.log('Events that would be sent to chatbot:');
        eventsData.forEach((event, index) => {
            console.log(`\n${index + 1}. ${event.titulo} (${event.tipo})`);
            console.log(`   Descripción: ${event.descripcion}`);
            console.log(`   Fecha: ${new Date(event.fechainicio).toLocaleString('es-CO')}`);
            if (event.fechafin && event.fechafin !== event.fechainicio) {
                console.log(`   Hasta: ${new Date(event.fechafin).toLocaleString('es-CO')}`);
            }
        });

        // Show what the chatbot context would look like
        console.log('\n\n=== CHATBOT CONTEXT ===');
        console.log('Eventos y Reuniones Programadas:');
        eventsData.forEach((event, index) => {
            console.log(`${index + 1}. ${event.titulo} (${event.tipo})`);
            console.log(`   Descripción: ${event.descripcion}`);
            console.log(`   Fecha: ${new Date(event.fechainicio).toLocaleString('es-CO')}`);
            if (event.fechafin && event.fechafin !== event.fechainicio) {
                console.log(` - ${new Date(event.fechafin).toLocaleString('es-CO')}`);
            }
        });
    } else {
        console.log('No events would be loaded for this user.');
    }
}

simulateUserLogin();
