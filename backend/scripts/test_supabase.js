// Diagnostic & Health-Check Script for Supabase Connectivity
// Run with: npm run db:check  (or node scripts/test_supabase.js)

const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 SmartSchemes — Supabase Health Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 1. Check environment variables
if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Environment check: FAILED');
  console.error('   Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  console.error('\n👉 Next steps:');
  console.error('   1. Create backend/.env (copy backend/.env.example)');
  console.error('   2. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from https://supabase.com/dashboard\n');
  process.exit(1);
}

if (supabaseUrl.includes('your-project') || serviceRoleKey.includes('your_supabase')) {
  console.error('⚠️  Environment check: PLACEHOLDERS DETECTED');
  console.error('   Your backend/.env still contains placeholder credentials.');
  console.error('   Please replace them with your actual Supabase project URL and service role key.\n');
  process.exit(1);
}

console.log('✅ Environment check: PASSED');
console.log(`   Project URL: ${supabaseUrl}\n`);

// 2. Initialize Supabase client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runCheck() {
  let hasErrors = false;

  // Check business_schemes table
  try {
    const { count, error } = await supabase
      .from('business_schemes')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Table 'business_schemes': ERROR (${error.message})`);
      hasErrors = true;
    } else {
      console.log(`✅ Table 'business_schemes': OK (${count ?? 0} rows found)`);
      if (count === 0) {
        console.log('   ⚠️  Table is empty. Run `npm run seed` to populate it.');
      }
    }
  } catch (err) {
    console.error(`❌ Table 'business_schemes': CONNECTION FAILED (${err.message})`);
    hasErrors = true;
  }

  // Check education_schemes table
  try {
    const { count, error } = await supabase
      .from('education_schemes')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Table 'education_schemes': ERROR (${error.message})`);
      hasErrors = true;
    } else {
      console.log(`✅ Table 'education_schemes': OK (${count ?? 0} rows found)`);
      if (count === 0) {
        console.log('   ⚠️  Table is empty. Run `npm run seed` to populate it.');
      }
    }
  } catch (err) {
    console.error(`❌ Table 'education_schemes': CONNECTION FAILED (${err.message})`);
    hasErrors = true;
  }

  // Check profiles table
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`❌ Table 'profiles': ERROR (${error.message})`);
      hasErrors = true;
    } else {
      console.log(`✅ Table 'profiles': OK (${count ?? 0} rows found)`);
    }
  } catch (err) {
    console.error(`❌ Table 'profiles': CONNECTION FAILED (${err.message})`);
    hasErrors = true;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (hasErrors) {
    console.error('❌ Supabase health check finished with errors.');
    console.error('👉 Have you run backend/supabase_setup_all.sql in the Supabase SQL Editor?');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  } else {
    console.log('🎉 Supabase database is connected and ready!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }
}

runCheck();
