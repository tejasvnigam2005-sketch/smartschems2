// Supabase Database Seeder
// Populates business_schemes and education_schemes in Supabase PostgreSQL

const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const { businessSchemes, educationSchemes } = require('./schemes');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ Missing Supabase credentials in environment.');
  console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in backend/.env');
  console.error('You can find these in: https://supabase.com/dashboard → Project Settings → API\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function formatBusinessScheme(s) {
  return {
    name: s.name,
    description: s.description,
    min_age: s.minAge ?? 0,
    max_age: s.maxAge ?? 100,
    min_income: s.minIncome ?? 0,
    max_income: s.maxIncome ?? 999999999,
    business_type: s.businessType || [],
    min_investment: s.minInvestment ?? 0,
    max_investment: s.maxInvestment ?? 999999999,
    states: s.states || ['all'],
    benefits: s.benefits || [],
    eligibility: s.eligibility || [],
    application_process: s.applicationProcess || [],
    deadline: s.deadline || 'Ongoing',
    website: s.website || '',
    funding_amount: s.fundingAmount || '',
    ministry: s.ministry || '',
    tags: s.tags || [],
    is_active: true,
  };
}

function formatEducationScheme(s) {
  return {
    name: s.name,
    description: s.description,
    min_age: s.minAge ?? 0,
    max_age: s.maxAge ?? 100,
    education_level: s.educationLevel || [],
    category: s.category || ['all'],
    min_income: s.minIncome ?? 0,
    max_income: s.maxIncome ?? 999999999,
    field_of_study: s.fieldOfStudy || [],
    states: s.states || ['all'],
    benefits: s.benefits || [],
    eligibility: s.eligibility || [],
    application_process: s.applicationProcess || [],
    deadline: s.deadline || 'Ongoing',
    website: s.website || '',
    scholarship_amount: s.scholarshipAmount || '',
    ministry: s.ministry || '',
    tags: s.tags || [],
    is_active: true,
  };
}

async function upsertSchemes(tableName, schemes) {
  // Try native upsert with onConflict first
  const { data, error } = await supabase
    .from(tableName)
    .upsert(schemes, { onConflict: 'name' })
    .select('id, name');

  if (!error) {
    return data?.length || schemes.length;
  }

  // If unique constraint is missing, fallback to match-and-insert/update
  console.log(`   ℹ️ Native upsert notice (${error.message}). Using safe match-and-save...`);
  const { data: existing, error: fetchErr } = await supabase
    .from(tableName)
    .select('id, name');

  if (fetchErr) throw new Error(`${tableName} fetch error: ${fetchErr.message}`);

  const existingMap = new Map((existing || []).map((item) => [item.name, item.id]));
  let count = 0;

  for (const item of schemes) {
    const existingId = existingMap.get(item.name);
    if (existingId) {
      const { error: updateErr } = await supabase
        .from(tableName)
        .update(item)
        .eq('id', existingId);
      if (updateErr) throw new Error(`Update error on "${item.name}": ${updateErr.message}`);
    } else {
      const { error: insertErr } = await supabase
        .from(tableName)
        .insert(item);
      if (insertErr) throw new Error(`Insert error on "${item.name}": ${insertErr.message}`);
    }
    count++;
  }

  return count;
}

async function seed() {
  console.log('\n🌱 Starting SmartSchemes Supabase Seeding...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);

  try {
    // 1. Seed Business Schemes
    console.log(`\n📦 Seeding ${businessSchemes.length} business schemes...`);
    const formattedBusiness = businessSchemes.map(formatBusinessScheme);
    const bCount = await upsertSchemes('business_schemes', formattedBusiness);
    console.log(`✅ Successfully seeded ${bCount} business schemes.`);

    // 2. Seed Education Schemes
    console.log(`\n🎓 Seeding ${educationSchemes.length} education schemes...`);
    const formattedEdu = educationSchemes.map(formatEducationScheme);
    const eCount = await upsertSchemes('education_schemes', formattedEdu);
    console.log(`✅ Successfully seeded ${eCount} education schemes.`);

    console.log('\n🎉 Supabase database seeding complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
