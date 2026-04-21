const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

// ─── Document requirement mappings ──────────────────────────────────
const COMMON_DOCUMENTS = {
  identity: { name: 'Aadhaar Card', description: 'Government-issued 12-digit unique identity number linked to biometric data.', howToObtain: 'Visit nearest Aadhaar Enrolment Centre or apply online at uidai.gov.in.', estimatedTime: '15–30 days for new enrolment' },
  pan: { name: 'PAN Card', description: 'Permanent Account Number issued by Income Tax Department for financial transactions.', howToObtain: 'Apply online via NSDL (onlineservices.nsdl.com) or UTIITSL portal.', estimatedTime: '7–15 working days' },
  passport_photo: { name: 'Passport-size Photographs', description: 'Recent colour photographs with white background (3.5cm x 4.5cm).', howToObtain: 'Visit any photo studio or use a passport photo app.', estimatedTime: 'Same day' },
  income_cert: { name: 'Income Certificate', description: 'Official certificate stating annual family income, issued by Revenue Department.', howToObtain: 'Apply at Tehsildar office, CSC centre, or through state e-District portal.', estimatedTime: '7–15 working days' },
  bank_account: { name: 'Bank Account Passbook / Statement', description: 'Active savings bank account with passbook showing IFSC and branch details.', howToObtain: 'Open a Jan Dhan or regular savings account at any nationalised bank.', estimatedTime: '1–3 working days' },
  address_proof: { name: 'Address Proof', description: 'Any valid document confirming current residential address.', howToObtain: 'Use electricity/water bill, Aadhaar card, voter ID, or rent agreement.', estimatedTime: 'Already available' },
  domicile: { name: 'Domicile Certificate', description: 'Certificate proving permanent residence in a particular state/UT.', howToObtain: 'Apply through Tehsildar office or state e-District portal.', estimatedTime: '7–21 working days' },
  caste_cert: { name: 'Caste Certificate', description: 'Official certificate confirming SC/ST/OBC/EWS category.', howToObtain: 'Apply at Tehsildar/SDM office with family records and Aadhaar.', estimatedTime: '15–30 working days' },
  education_cert: { name: 'Educational Certificates & Marksheets', description: 'Board certificates and marksheets from the last qualifying examination.', howToObtain: 'Obtain from school/college administration office.', estimatedTime: 'Already available' },
  admission_letter: { name: 'Admission Letter / Bonafide Certificate', description: 'Official letter from institution confirming admission.', howToObtain: 'Request from the admission office of your institution.', estimatedTime: '1–3 working days' },
  business_plan: { name: 'Business Plan / Project Report', description: 'Detailed document outlining business idea, market analysis, financial projections.', howToObtain: 'Prepare yourself or hire a CA/consultant.', estimatedTime: '3–7 days' },
  gst_registration: { name: 'GST Registration Certificate', description: 'Goods and Services Tax registration for businesses.', howToObtain: 'Register online at gst.gov.in.', estimatedTime: '3–7 working days' },
  msme_registration: { name: 'Udyam Registration Certificate', description: 'MSME registration certificate for micro, small, and medium enterprises.', howToObtain: 'Register free at udyamregistration.gov.in.', estimatedTime: '1–2 working days' },
  land_records: { name: 'Land Ownership Records', description: 'Khasra/Khatauni or equivalent land records.', howToObtain: 'Obtain from Tehsildar office or state Bhulekh/Bhoomi portal.', estimatedTime: '1–7 working days' },
  minority_cert: { name: 'Minority Community Certificate', description: 'Certificate confirming minority community status.', howToObtain: 'Apply at District Magistrate office.', estimatedTime: '15–21 working days' },
  fee_receipt: { name: 'Fee Receipt from Institution', description: 'Official receipt showing fees paid to the educational institution.', howToObtain: 'Collect from accounts section of your institution.', estimatedTime: 'Same day' },
  iec: { name: 'Import Export Code (IEC)', description: 'Mandatory code for import/export of goods and services.', howToObtain: 'Apply online at dgft.gov.in.', estimatedTime: '3–5 working days' }
};

function getRequiredDocuments(scheme, schemeType) {
  const docs = [];
  const tags = (scheme.tags || []).map(t => t.toLowerCase()).join(' ');
  const name = (scheme.name || '').toLowerCase();
  const desc = (scheme.description || '').toLowerCase();
  const combined = `${tags} ${name} ${desc}`;

  docs.push(COMMON_DOCUMENTS.identity);
  docs.push(COMMON_DOCUMENTS.passport_photo);
  docs.push(COMMON_DOCUMENTS.bank_account);
  docs.push(COMMON_DOCUMENTS.address_proof);

  if (schemeType === 'business') {
    docs.push(COMMON_DOCUMENTS.pan);
    docs.push(COMMON_DOCUMENTS.business_plan);
    if (combined.includes('msme') || combined.includes('small enterprise') || combined.includes('micro')) docs.push(COMMON_DOCUMENTS.msme_registration);
    if (combined.includes('export') || combined.includes('iec') || combined.includes('international trade')) docs.push(COMMON_DOCUMENTS.iec);
    if (combined.includes('gst') || combined.includes('manufacturing') || combined.includes('retail')) docs.push(COMMON_DOCUMENTS.gst_registration);
    if (combined.includes('farmer') || combined.includes('agriculture') || combined.includes('kisan')) docs.push(COMMON_DOCUMENTS.land_records);
    if (combined.includes('sc') || combined.includes('st') || combined.includes('women') || combined.includes('scheduled')) docs.push(COMMON_DOCUMENTS.caste_cert);
    docs.push(COMMON_DOCUMENTS.income_cert);
  } else {
    docs.push(COMMON_DOCUMENTS.income_cert);
    docs.push(COMMON_DOCUMENTS.education_cert);
    docs.push(COMMON_DOCUMENTS.admission_letter);
    docs.push(COMMON_DOCUMENTS.fee_receipt);
    if (combined.includes('sc') || combined.includes('st') || combined.includes('obc') || combined.includes('ews') || combined.includes('caste')) docs.push(COMMON_DOCUMENTS.caste_cert);
    if (combined.includes('minority') || combined.includes('muslim') || combined.includes('maulana')) docs.push(COMMON_DOCUMENTS.minority_cert);
    if (combined.includes('domicile') || combined.includes('j&k') || combined.includes('ladakh') || combined.includes('northeast') || combined.includes('ne region')) docs.push(COMMON_DOCUMENTS.domicile);
  }

  return docs;
}

function generateStepTitle(stepText, index) {
  const lower = stepText.toLowerCase();
  if (lower.includes('register') || lower.includes('sign up')) return 'Registration';
  if (lower.includes('visit') && index === 0) return 'Visit Portal / Office';
  if (lower.includes('fill') || lower.includes('application')) return 'Fill Application';
  if (lower.includes('submit') || lower.includes('upload')) return 'Submit Documents';
  if (lower.includes('verif')) return 'Verification';
  if (lower.includes('evaluat') || lower.includes('review')) return 'Evaluation';
  if (lower.includes('approv') || lower.includes('sanction')) return 'Approval';
  if (lower.includes('disburs') || lower.includes('credit')) return 'Disbursement';
  if (lower.includes('select') || lower.includes('choose')) return 'Selection';
  if (lower.includes('counsell')) return 'Counselling';
  if (lower.includes('site visit') || lower.includes('due diligence')) return 'Due Diligence';
  if (lower.includes('connect') || lower.includes('bank')) return 'Bank Liaison';
  if (lower.includes('attend') || lower.includes('training')) return 'Training';
  if (lower.includes('appear') || lower.includes('exam')) return 'Examination';
  return `Step ${index + 1}`;
}

function getApplicationGuide(scheme) {
  const steps = [];
  const process = scheme.application_process || [];

  process.forEach((step, i) => {
    const stepObj = { stepNumber: i + 1, title: generateStepTitle(step, i), description: step, actionLink: null };
    const urlMatch = step.match(/(?:visit\s+|at\s+|through\s+|via\s+)?((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s,)]*)?)/i);
    if (urlMatch) {
      let url = urlMatch[1];
      if (!url.startsWith('http')) url = 'https://' + url;
      stepObj.actionLink = url;
    }
    steps.push(stepObj);
  });

  if (process.length > 0 && !process[process.length - 1].toLowerCase().includes('disburs')) {
    steps.push({
      stepNumber: process.length + 1,
      title: 'Track & Follow Up',
      description: 'Monitor your application status through the respective portal. Keep copies of all submitted documents.',
      actionLink: scheme.website || null
    });
  }

  return steps;
}

// ─── GET /api/scheme-guide/documents/:schemeType/:id ─────────────────
router.get('/documents/:schemeType/:id', async (req, res) => {
  try {
    const { schemeType, id } = req.params;
    const table = schemeType === 'business' ? 'business_schemes' : schemeType === 'education' ? 'education_schemes' : null;
    if (!table) return res.status(400).json({ message: 'Invalid scheme type' });

    const { data: scheme, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error || !scheme) return res.status(404).json({ message: 'Scheme not found' });

    const documents = getRequiredDocuments(scheme, schemeType);
    res.json({ schemeId: scheme.id, schemeName: scheme.name, schemeType, documents, totalDocuments: documents.length });
  } catch (error) {
    console.error('Document checklist error:', error);
    res.status(500).json({ message: 'Server error generating document checklist' });
  }
});

// ─── GET /api/scheme-guide/steps/:schemeType/:id ─────────────────────
router.get('/steps/:schemeType/:id', async (req, res) => {
  try {
    const { schemeType, id } = req.params;
    const table = schemeType === 'business' ? 'business_schemes' : schemeType === 'education' ? 'education_schemes' : null;
    if (!table) return res.status(400).json({ message: 'Invalid scheme type' });

    const { data: scheme, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error || !scheme) return res.status(404).json({ message: 'Scheme not found' });

    const steps = getApplicationGuide(scheme);
    res.json({ schemeId: scheme.id, schemeName: scheme.name, schemeType, website: scheme.website || '', deadline: scheme.deadline || 'Ongoing', steps, totalSteps: steps.length });
  } catch (error) {
    console.error('Application guide error:', error);
    res.status(500).json({ message: 'Server error generating application guide' });
  }
});

module.exports = router;
