
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env vars manually since we are running with node
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- Checking Supabase Connection ---');
    console.log(`URL: ${supabaseUrl}`);

    // 1. Check DB Connection (Products Table)
    console.log('\n1. Checking Database (Products Table)...');
    try {
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('❌ DB Error:', error.message);
        } else {
            console.log('✅ Connected to DB. Products table exists.');
        }
    } catch (e) {
        console.error('❌ DB Connection Failed:', e.message);
    }

    // 2. Check Storage
    console.log('\n2. Checking Storage Buckets...');
    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
            console.error('❌ Storage Error:', error.message);
        } else {
            console.log('✅ Storage connected.');
            const bucket = data.find(b => b.name === 'product-images');
            if (bucket) {
                console.log('✅ Bucket "product-images" FOUND.');
            } else {
                console.error('❌ Bucket "product-images" NOT FOUND.');
                console.log('   Available buckets:', data.map(b => b.name).join(', ') || 'None');
            }
        }
    } catch (e) {
        console.error('❌ Storage Check Failed:', e.message);
    }
}

check();
