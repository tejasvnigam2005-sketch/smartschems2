const COMMON_DOCUMENTS = {
  identity: { name: 'Aadhaar Card', description: 'Government-issued 12-digit unique identity number linked to biometric data.', howToObtain: 'Visit nearest Aadhaar Enrolment Centre or apply online at uidai.gov.in. You can also update existing Aadhaar at any centre.', estimatedTime: '15–30 days for new enrolment', applyUrl: 'https://uidai.gov.in/' },
  pan: { name: 'PAN Card', description: 'Permanent Account Number issued by Income Tax Department for financial transactions.', howToObtain: 'Apply online via NSDL (onlineservices.nsdl.com) or UTIITSL portal. Fill Form 49A with ID proof.', estimatedTime: '7–15 working days', applyUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html' },
  passport_photo: { name: 'Passport-size Photographs', description: 'Recent colour photographs with white background (3.5cm x 4.5cm).', howToObtain: 'Visit any photo studio or use a passport photo app to get the correct dimensions.', estimatedTime: 'Same day', applyUrl: '' },
  income_cert: { name: 'Income Certificate', description: 'Official certificate stating annual family income, issued by Revenue Department.', howToObtain: 'Apply at Tehsildar office, CSC centre, or through state e-District portal with salary slips or self-declaration.', estimatedTime: '7–15 working days', applyUrl: 'https://edistrict.up.gov.in/' },
  bank_account: { name: 'Bank Account Passbook / Statement', description: 'Active savings bank account with passbook showing IFSC, branch details, and recent transactions.', howToObtain: 'Open a Jan Dhan or regular savings account at any nationalised bank with Aadhaar and PAN.', estimatedTime: '1–3 working days for new account', applyUrl: 'https://www.pmjdy.gov.in/' },
  address_proof: { name: 'Address Proof', description: 'Any valid document confirming current residential address (utility bill, voter ID, Aadhaar).', howToObtain: 'Use electricity/water bill (< 3 months old), Aadhaar card, voter ID, or rent agreement.', estimatedTime: 'Already available / same day', applyUrl: '' },
  domicile: { name: 'Domicile Certificate', description: 'Certificate proving permanent residence in a particular state/UT.', howToObtain: 'Apply through Tehsildar office or state e-District portal with address proof and Aadhaar.', estimatedTime: '7–21 working days', applyUrl: 'https://serviceonline.gov.in/' },
  caste_cert: { name: 'Caste Certificate', description: 'Official certificate from Revenue Department confirming SC/ST/OBC/EWS category.', howToObtain: 'Apply at Tehsildar/Sub-Divisional Magistrate office with family records and Aadhaar.', estimatedTime: '15–30 working days', applyUrl: 'https://serviceonline.gov.in/' },
  education_cert: { name: 'Educational Certificates & Marksheets', description: 'Board certificates and marksheets from the last qualifying examination.', howToObtain: 'Obtain from your school/college administration office. Request duplicates from the issuing board if lost.', estimatedTime: 'Already available / 15–30 days for duplicates', applyUrl: '' },
  admission_letter: { name: 'Admission Letter / Bonafide Certificate', description: 'Official letter from the institution confirming admission to a specific course.', howToObtain: 'Request from the admission office or registrar of your institution after securing admission.', estimatedTime: '1–3 working days', applyUrl: '' },
  business_plan: { name: 'Business Plan / Project Report', description: 'Detailed document outlining business idea, market analysis, financial projections, and implementation strategy.', howToObtain: 'Prepare yourself or hire a CA/consultant. MSME DI offices and incubators offer free assistance.', estimatedTime: '3–7 days to prepare', applyUrl: 'https://msme.gov.in/' },
  gst_registration: { name: 'GST Registration Certificate', description: 'Goods and Services Tax registration for businesses with turnover above threshold.', howToObtain: 'Register online at gst.gov.in with PAN, Aadhaar, business address proof, and bank details.', estimatedTime: '3–7 working days', applyUrl: 'https://www.gst.gov.in/' },
  msme_registration: { name: 'Udyam Registration Certificate', description: 'MSME registration certificate (replaces old Udyog Aadhaar) for micro, small, and medium enterprises.', howToObtain: 'Register free at udyamregistration.gov.in with Aadhaar and PAN. Fully online process.', estimatedTime: '1–2 working days', applyUrl: 'https://udyamregistration.gov.in/' },
  land_records: { name: 'Land Ownership Records', description: 'Khasra/Khatauni or equivalent land records showing ownership of cultivable land.', howToObtain: 'Obtain from Tehsildar office or download from state Bhulekh/Bhoomi portal.', estimatedTime: '1–7 working days', applyUrl: 'https://upbhulekh.gov.in/' },
  minority_cert: { name: 'Minority Community Certificate', description: 'Certificate from District Magistrate or competent authority confirming minority community status.', howToObtain: 'Apply at District Magistrate office or through state minority commission portal.', estimatedTime: '15–21 working days', applyUrl: 'https://serviceonline.gov.in/' },
  fee_receipt: { name: 'Fee Receipt from Institution', description: 'Official receipt showing tuition and other fees paid to the educational institution.', howToObtain: 'Collect from the accounts/fee section of your institution after paying fees.', estimatedTime: 'Same day', applyUrl: '' },
  iec: { name: 'Import Export Code (IEC)', description: 'Mandatory code issued by DGFT for any person involved in import/export of goods and services.', howToObtain: 'Apply online at dgft.gov.in with PAN, Aadhaar, bank certificate, and address proof.', estimatedTime: '3–5 working days', applyUrl: 'https://www.dgft.gov.in/' }
};

function getRequiredDocuments(scheme, schemeType) {
  const docs = [];
  const tags = (scheme.tags || []).map(t => t.toLowerCase()).join(' ');
  const name = (scheme.name || '').toLowerCase();
  const desc = (scheme.description || '').toLowerCase();
  const combined = `${tags} ${name} ${desc}`;

  // Universal documents
  docs.push(COMMON_DOCUMENTS.identity);
  docs.push(COMMON_DOCUMENTS.passport_photo);
  docs.push(COMMON_DOCUMENTS.bank_account);
  docs.push(COMMON_DOCUMENTS.address_proof);

  if (schemeType === 'business') {
    docs.push(COMMON_DOCUMENTS.pan);
    docs.push(COMMON_DOCUMENTS.business_plan);

    if (combined.includes('msme') || combined.includes('small enterprise') || combined.includes('micro')) {
      docs.push(COMMON_DOCUMENTS.msme_registration);
    }
    if (combined.includes('export') || combined.includes('iec') || combined.includes('international trade')) {
      docs.push(COMMON_DOCUMENTS.iec);
    }
    if (combined.includes('gst') || combined.includes('manufacturing') || combined.includes('retail')) {
      docs.push(COMMON_DOCUMENTS.gst_registration);
    }
    if (combined.includes('farmer') || combined.includes('agriculture') || combined.includes('kisan')) {
      docs.push(COMMON_DOCUMENTS.land_records);
    }
    if (combined.includes('sc') || combined.includes('st') || combined.includes('women') || combined.includes('scheduled')) {
      docs.push(COMMON_DOCUMENTS.caste_cert);
    }
    docs.push(COMMON_DOCUMENTS.income_cert);
  } else {
    // Education
    docs.push(COMMON_DOCUMENTS.income_cert);
    docs.push(COMMON_DOCUMENTS.education_cert);
    docs.push(COMMON_DOCUMENTS.admission_letter);
    docs.push(COMMON_DOCUMENTS.fee_receipt);

    if (combined.includes('sc') || combined.includes('st') || combined.includes('obc') || combined.includes('ews') || combined.includes('caste')) {
      docs.push(COMMON_DOCUMENTS.caste_cert);
    }
    if (combined.includes('minority') || combined.includes('muslim') || combined.includes('maulana')) {
      docs.push(COMMON_DOCUMENTS.minority_cert);
    }
    if (combined.includes('domicile') || combined.includes('j&k') || combined.includes('ladakh') || combined.includes('northeast') || combined.includes('ne region')) {
      docs.push(COMMON_DOCUMENTS.domicile);
    }
  }

  return docs;
}

module.exports = {
  COMMON_DOCUMENTS,
  getRequiredDocuments
};
