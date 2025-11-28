
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkygbdtvtdhytkhficyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreWdiZHR2dGRoeXRraGZpY3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDg1OTEsImV4cCI6MjA3OTcyNDU5MX0.I4g9iRXnNmnrQXdH3KesfcwUdYWk5zo2t1iKauCXNkA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
    console.log('Checking events...');

    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    console.log(`Start of year: ${startOfYear.toISOString()}`);

    // Test the NEW filter
    const { data: filteredEvents, error: filteredError } = await supabase
        .from('evento')
        .select('*')
        .gte('fechainicio', startOfYear.toISOString())
        .order('fechainicio', { ascending: true });

    if (filteredError) {
        console.error('Error fetching filtered events:', filteredError);
    } else {
        console.log(`\n--- FILTERED EVENTS (>= ${startOfYear.toISOString()}) ---`);
        filteredEvents?.forEach(e => {
            console.log(`- ${e.titulo} (${e.fechainicio})`);
        });
    }
}

checkEvents();
