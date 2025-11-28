
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkygbdtvtdhytkhficyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreWdiZHR2dGRoeXRraGZpY3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDg1OTEsImV4cCI6MjA3OTcyNDU5MX0.I4g9iRXnNmnrQXdH3KesfcwUdYWk5zo2t1iKauCXNkA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
    console.log('Checking events...');

    // Get all events without filter first
    const { data: allEvents, error: allEventsError } = await supabase
        .from('evento')
        .select('*');

    if (allEventsError) {
        console.error('Error fetching all events:', allEventsError);
    } else {
        console.log(`Total events found: ${allEvents?.length}`);
        allEvents?.forEach(e => {
            console.log(`- ${e.titulo} (Start: ${e.fechainicio}, End: ${e.fechafin})`);
        });
    }

    const now = new Date().toISOString();
    console.log(`\nCurrent time (ISO): ${now}`);

    // Test the filter used in the app
    const { data: filteredEvents, error: filteredError } = await supabase
        .from('evento')
        .select('*')
        .gte('fechafin', now);

    if (filteredError) {
        console.error('Error fetching filtered events:', filteredError);
    } else {
        console.log(`Filtered events (fechafin >= now): ${filteredEvents?.length}`);
        filteredEvents?.forEach(e => {
            console.log(`- ${e.titulo}`);
        });
    }
}

checkEvents();
