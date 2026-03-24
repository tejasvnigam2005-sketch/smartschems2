const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BusinessScheme = require('../models/BusinessScheme');
const EducationScheme = require('../models/EducationScheme');

dotenv.config();

const businessSchemes = [
  {
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    description: "Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. Three categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh).",
    minAge: 18, maxAge: 65,
    minIncome: 0, maxIncome: 1500000,
    businessType: ['startup', 'msme', 'retail', 'services', 'manufacturing'],
    minInvestment: 0, maxInvestment: 1000000,
    states: ['all'],
    benefits: [
      "Collateral-free loans up to ₹10 lakh",
      "Low interest rates",
      "No processing fee",
      "Flexible repayment tenure of 5-7 years",
      "MUDRA Card for working capital needs"
    ],
    eligibility: [
      "Indian citizen aged 18-65",
      "Non-corporate small business entity",
      "Has a business plan or existing business",
      "No previous loan default"
    ],
    applicationProcess: [
      "Visit nearest bank branch or NBFC",
      "Fill MUDRA loan application form",
      "Submit business plan and identity documents",
      "Bank evaluates and sanctions loan",
      "Loan disbursement within 7-10 working days"
    ],
    deadline: "Ongoing",
    website: "https://www.mudra.org.in",
    fundingAmount: "Up to ₹10 Lakh",
    ministry: "Ministry of Finance",
    tags: ['mudra', 'loan', 'small business', 'micro enterprise', 'collateral free']
  },
  {
    name: "Startup India Seed Fund Scheme (SISFS)",
    description: "Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization through incubators.",
    minAge: 21, maxAge: 55,
    minIncome: 0, maxIncome: 5000000,
    businessType: ['startup', 'technology'],
    minInvestment: 100000, maxInvestment: 5000000,
    states: ['all'],
    benefits: [
      "Grants up to ₹20 lakh for validation of proof of concept",
      "Loans up to ₹50 lakh for market launch",
      "Mentorship and networking opportunities",
      "Access to government tenders",
      "Tax exemptions for 3 years"
    ],
    eligibility: [
      "DPIIT-recognized startup",
      "Not more than 2 years old at time of application",
      "Must have a technology-driven business model",
      "Should not have received funding above ₹10 lakh from other government schemes"
    ],
    applicationProcess: [
      "Register on Startup India portal",
      "Apply through an eligible incubator",
      "Submit business plan and financials",
      "Expert committee evaluation",
      "Approval and fund disbursement through incubator"
    ],
    deadline: "March 2026",
    website: "https://seedfund.startupindia.gov.in",
    fundingAmount: "Up to ₹50 Lakh",
    ministry: "DPIIT, Ministry of Commerce",
    tags: ['startup', 'seed fund', 'innovation', 'technology', 'incubator']
  },
  {
    name: "PM Vishwakarma Yojana",
    description: "End-to-end support for traditional artisans and craftspeople through recognition, skill training, toolkit incentives, credit access, and market support.",
    minAge: 18, maxAge: 60,
    minIncome: 0, maxIncome: 800000,
    businessType: ['manufacturing', 'services', 'retail'],
    minInvestment: 0, maxInvestment: 300000,
    states: ['all'],
    benefits: [
      "Recognition through PM Vishwakarma certificate and ID card",
      "Skill training: ₹500/day stipend for 5-7 days",
      "Toolkit incentive up to ₹15,000",
      "Collateral-free loan: ₹1 lakh (1st tranche), ₹2 lakh (2nd tranche) at 5% interest",
      "Marketing support through GeM portal and trade fairs"
    ],
    eligibility: [
      "Traditional artisan or craftsperson",
      "Working with hands and tools in one of 18 identified trades",
      "Registered under PM Vishwakarma portal",
      "Age 18 years and above"
    ],
    applicationProcess: [
      "Register at pmvishwakarma.gov.in",
      "Verification by Gram Panchayat/ULB",
      "Attend skill training program",
      "Apply for toolkit incentive and credit",
      "Access marketing platforms"
    ],
    deadline: "Ongoing (5-year scheme)",
    website: "https://pmvishwakarma.gov.in",
    fundingAmount: "Up to ₹3 Lakh loan + ₹15,000 toolkit",
    ministry: "Ministry of MSME",
    tags: ['artisan', 'craftspeople', 'skill', 'toolkit', 'traditional']
  },
  {
    name: "Stand-Up India Scheme",
    description: "Facilitates bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs for greenfield enterprises in manufacturing, services, or trading.",
    minAge: 18, maxAge: 65,
    minIncome: 0, maxIncome: 3000000,
    businessType: ['startup', 'msme', 'manufacturing', 'services', 'retail'],
    minInvestment: 1000000, maxInvestment: 10000000,
    states: ['all'],
    benefits: [
      "Loans from ₹10 lakh to ₹1 crore",
      "Composite loan covering term loan and working capital",
      "Repayment period up to 7 years",
      "Margin money of up to 25%",
      "Rate of interest: lowest applicable rate + 3% + tenor premium"
    ],
    eligibility: [
      "SC/ST and/or women entrepreneurs",
      "Age 18 years and above",
      "Setting up greenfield enterprise",
      "Non-individual enterprise should have 51% shareholding by SC/ST/woman",
      "Borrower should not be in default to any bank/financial institution"
    ],
    applicationProcess: [
      "Visit www.standupmitra.in portal",
      "Register and fill application",
      "Connect with nearest bank branch",
      "Submit project report and documents",
      "Loan sanctioned within 30 days of application"
    ],
    deadline: "Extended till 2025",
    website: "https://www.standupmitra.in",
    fundingAmount: "₹10 Lakh to ₹1 Crore",
    ministry: "Ministry of Finance",
    tags: ['women', 'sc', 'st', 'greenfield', 'bank loan']
  },
  {
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    description: "Provides collateral-free credit facility to micro and small enterprises. Covers both new and existing enterprises in manufacturing and service sectors.",
    minAge: 18, maxAge: 65,
    minIncome: 0, maxIncome: 5000000,
    businessType: ['msme', 'manufacturing', 'services', 'startup'],
    minInvestment: 0, maxInvestment: 5000000,
    states: ['all'],
    benefits: [
      "Collateral-free loans up to ₹5 crore",
      "Cover up to 85% of the loan amount",
      "Available for both new and existing MSEs",
      "No third-party guarantee required",
      "Lower effective cost of credit"
    ],
    eligibility: [
      "Micro or Small Enterprise as per MSME Act",
      "Both new and existing enterprises eligible",
      "Manufacturing or service sector",
      "Should have a viable project/business"
    ],
    applicationProcess: [
      "Apply through any eligible lending institution",
      "Submit business proposal with financials",
      "Lending institution evaluates the proposal",
      "If approved, guarantee cover obtained from CGTMSE",
      "Loan disbursed without collateral"
    ],
    deadline: "Ongoing",
    website: "https://www.cgtmse.in",
    fundingAmount: "Up to ₹5 Crore",
    ministry: "Ministry of MSME",
    tags: ['collateral free', 'guarantee', 'msme', 'credit', 'small enterprise']
  },
  {
    name: "PM Kisan Samman Nidhi Yojana",
    description: "Direct income support of ₹6,000 per year to all farmer families across the country, paid in three equal installments every four months.",
    minAge: 18, maxAge: 75,
    minIncome: 0, maxIncome: 600000,
    businessType: ['agriculture'],
    minInvestment: 0, maxInvestment: 500000,
    states: ['all'],
    benefits: [
      "₹6,000 per year direct bank transfer",
      "Three installments of ₹2,000 each",
      "No intermediary — direct to farmer's account",
      "All landholding farmer families eligible",
      "KCC integration for crop loans"
    ],
    eligibility: [
      "Small and marginal farmer family",
      "Must own cultivable land",
      "Should not hold constitutional post",
      "Not a current or former minister/MP/MLA",
      "Professional income should not exceed limit"
    ],
    applicationProcess: [
      "Visit local Common Service Centre (CSC)",
      "Register at pmkisan.gov.in",
      "Provide Aadhaar, bank details, and land records",
      "State government verifies records",
      "Amount credited directly to bank account"
    ],
    deadline: "Ongoing",
    website: "https://pmkisan.gov.in",
    fundingAmount: "₹6,000/year",
    ministry: "Ministry of Agriculture",
    tags: ['farmer', 'kisan', 'direct benefit', 'agriculture', 'income support']
  },
  {
    name: "Atal Innovation Mission (AIM) - Atal Incubation Centres",
    description: "Establishes world-class incubation centres that foster innovation and entrepreneurship across India. Provides grant-in-aid up to ₹10 crore for establishing incubators.",
    minAge: 21, maxAge: 50,
    minIncome: 0, maxIncome: 10000000,
    businessType: ['startup', 'technology'],
    minInvestment: 500000, maxInvestment: 50000000,
    states: ['all'],
    benefits: [
      "Grant-in-aid up to ₹10 crore over 5 years",
      "Access to mentors and industry experts",
      "State-of-the-art infrastructure",
      "Networking with global innovation ecosystem",
      "Connect with angel investors and VCs"
    ],
    eligibility: [
      "Higher educational institutions or R&D institutes can apply",
      "Corporate sector and alternative investment funds",
      "Must have space and infrastructure readiness",
      "Should demonstrate innovation focus"
    ],
    applicationProcess: [
      "Apply through AIM portal during open call",
      "Submit detailed proposal with infrastructure plan",
      "Expert committee evaluation",
      "Site visit and due diligence",
      "Grant disbursement in tranches"
    ],
    deadline: "Periodic calls",
    website: "https://aim.gov.in",
    fundingAmount: "Up to ₹10 Crore",
    ministry: "NITI Aayog",
    tags: ['innovation', 'incubation', 'atal', 'startup ecosystem', 'technology']
  },
  {
    name: "SIDBI Make in India Soft Loan Fund (SMILE)",
    description: "Provides soft loans to MSMEs for setting up new enterprises or expansion/modernization of existing units in the manufacturing sector.",
    minAge: 21, maxAge: 60,
    minIncome: 0, maxIncome: 8000000,
    businessType: ['msme', 'manufacturing', 'startup'],
    minInvestment: 1000000, maxInvestment: 25000000,
    states: ['all'],
    benefits: [
      "Soft loans up to ₹25 crore",
      "Subsidized interest rates (around 2% lower than market)",
      "Longer repayment period up to 10 years",
      "Supports manufacturing modernization",
      "Quick loan processing"
    ],
    eligibility: [
      "Registered MSME unit",
      "Manufacturing sector focus",
      "Viable business plan for expansion/new setup",
      "Satisfactory credit history"
    ],
    applicationProcess: [
      "Apply through SIDBI portal or branch",
      "Submit project report and financials",
      "SIDBI evaluates the proposal",
      "Terms sanctioned and agreed upon",
      "Disbursement aligned with project milestones"
    ],
    deadline: "Ongoing",
    website: "https://www.sidbi.in",
    fundingAmount: "Up to ₹25 Crore",
    ministry: "Ministry of Finance (SIDBI)",
    tags: ['sidbi', 'soft loan', 'make in india', 'manufacturing', 'expansion']
  },
  {
    name: "Agriculture Infrastructure Fund (AIF)",
    description: "Financing facility for creating post-harvest management infrastructure and community farming assets, with interest subvention and credit guarantee support.",
    minAge: 18, maxAge: 70,
    minIncome: 0, maxIncome: 2000000,
    businessType: ['agriculture'],
    minInvestment: 100000, maxInvestment: 20000000,
    states: ['all'],
    benefits: [
      "Loans up to ₹2 crore with 3% interest subvention for 7 years",
      "Credit guarantee coverage under CGTMSE",
      "Moratorium for repayment",
      "Covers warehouses, cold storage, grading/sorting units",
      "FPOs and agri-entrepreneurs eligible"
    ],
    eligibility: [
      "Farmers, FPOs, PACS, Marketing Cooperative Societies",
      "Agri-entrepreneurs, Startups",
      "State agencies and APMCs",
      "Project should be viable and contribute to agri infrastructure"
    ],
    applicationProcess: [
      "Register on AIF portal (agriinfra.dac.gov.in)",
      "Select project type and fill details",
      "Choose lending bank",
      "Bank evaluates and sanctions loan",
      "Interest subvention applied automatically"
    ],
    deadline: "Until 2025-26",
    website: "https://agriinfra.dac.gov.in",
    fundingAmount: "Up to ₹2 Crore with interest subvention",
    ministry: "Ministry of Agriculture",
    tags: ['agriculture', 'infrastructure', 'cold storage', 'warehouse', 'FPO']
  },
  {
    name: "Export Promotion Capital Goods (EPCG) Scheme",
    description: "Allows import of capital goods at zero customs duty for export production, subject to export obligation of 6 times the duty saved over 6 years.",
    minAge: 21, maxAge: 65,
    minIncome: 500000, maxIncome: 100000000,
    businessType: ['export', 'manufacturing'],
    minInvestment: 5000000, maxInvestment: 100000000,
    states: ['all'],
    benefits: [
      "Zero customs duty on capital goods imports",
      "Applicable on new and second-hand capital goods",
      "Boost manufacturing competitiveness",
      "6-year export obligation period",
      "Technology upgradation support"
    ],
    eligibility: [
      "Manufacturer exporter or merchant exporter",
      "EOU/SEZ unit or status holder",
      "Must commit to export obligations",
      "Valid IEC (Import Export Code) required"
    ],
    applicationProcess: [
      "Apply online through DGFT portal",
      "Submit application with EPCG authorization",
      "Import capital goods at zero duty",
      "Fulfill export obligation within 6 years",
      "Submit export evidence for obligation redemption"
    ],
    deadline: "Ongoing",
    website: "https://www.dgft.gov.in",
    fundingAmount: "Zero customs duty on capital goods",
    ministry: "Ministry of Commerce",
    tags: ['export', 'capital goods', 'customs', 'manufacturing', 'international trade']
  }
];

const educationSchemes = [
  {
    name: "PM Vidyalaxmi Scheme",
    description: "Provides collateral-free, guarantor-free educational loans for students admitted to top quality higher education institutions. Financial support covers full tuition and related expenses.",
    minAge: 17, maxAge: 30,
    educationLevel: ['ug', 'pg', 'diploma'],
    category: ['all'],
    minIncome: 0, maxIncome: 800000,
    fieldOfStudy: ['all'],
    states: ['all'],
    benefits: [
      "Collateral-free education loans up to ₹10 lakh",
      "Interest subvention of 3% during moratorium period",
      "Full tuition fee coverage",
      "75% government credit risk guarantee",
      "Simple digital application process"
    ],
    eligibility: [
      "Admitted to NIRF top-ranked institutions",
      "NAAC A+ graded institutions",
      "Annual family income up to ₹8 lakh for interest subvention",
      "Indian citizen",
      "First-time higher education loan"
    ],
    applicationProcess: [
      "Visit pmvidyalaxmi.gov.in portal",
      "Register with academic and personal details",
      "Select institution and course",
      "Apply to multiple banks through unified platform",
      "Loan processed within 15 working days"
    ],
    deadline: "Ongoing",
    website: "https://pmvidyalaxmi.gov.in",
    scholarshipAmount: "Loan up to ₹10 Lakh + 3% interest subvention",
    ministry: "Ministry of Education",
    tags: ['education loan', 'collateral free', 'higher education', 'vidyalaxmi']
  },
  {
    name: "National Scholarship Portal (NSP) - Central Sector Scheme",
    description: "Scholarship for students from non-creamy layer families studying in colleges/universities. Merit-based scholarship for UG and PG students across India.",
    minAge: 16, maxAge: 25,
    educationLevel: ['ug', 'pg'],
    category: ['all'],
    minIncome: 0, maxIncome: 800000,
    fieldOfStudy: ['all'],
    states: ['all'],
    benefits: [
      "₹12,000/year for UG students (first 3 years)",
      "₹20,000/year for PG students",
      "Direct transfer to bank account",
      "Covers tuition and maintenance",
      "Renewable annually on performance"
    ],
    eligibility: [
      "Must be in top 20 percentile of board exam",
      "Family income below ₹8 lakh per annum",
      "Regular student in recognized institution",
      "Must maintain 50% attendance",
      "Indian nationality"
    ],
    applicationProcess: [
      "Register on scholarships.gov.in",
      "Fill application with academic details",
      "Upload required documents",
      "Institute verification",
      "Scholarship disbursed after final verification"
    ],
    deadline: "October - December annually",
    website: "https://scholarships.gov.in",
    scholarshipAmount: "₹12,000 - ₹20,000 per year",
    ministry: "Ministry of Education",
    tags: ['scholarship', 'merit', 'central', 'undergraduate', 'postgraduate']
  },
  {
    name: "Post-Matric Scholarship for SC Students",
    description: "Central government scholarship for Scheduled Caste students pursuing post-matriculation or post-secondary education. Covers maintenance allowance and non-refundable fees.",
    minAge: 15, maxAge: 35,
    educationLevel: ['school', 'ug', 'pg', 'phd', 'diploma'],
    category: ['sc'],
    minIncome: 0, maxIncome: 250000,
    fieldOfStudy: ['all'],
    states: ['all'],
    benefits: [
      "Full tuition fee reimbursement",
      "Monthly maintenance allowance (₹550-₹1,200 depending on level)",
      "Reader charges for blind students",
      "Study tour charges",
      "Thesis typing and printing charges for research scholars"
    ],
    eligibility: [
      "Belongs to Scheduled Caste category",
      "Family income not exceeding ₹2.5 lakh per annum",
      "Studying in recognized institution",
      "Must have passed qualifying exam",
      "Not receiving any other scholarship"
    ],
    applicationProcess: [
      "Apply through National Scholarship Portal",
      "Upload caste certificate and income proof",
      "Submit fee receipt from institution",
      "Institute forwards verified application",
      "State government approves and disburses"
    ],
    deadline: "August - November annually",
    website: "https://scholarships.gov.in",
    scholarshipAmount: "Full tuition + ₹550-₹1,200/month maintenance",
    ministry: "Ministry of Social Justice & Empowerment",
    tags: ['sc', 'post-matric', 'scheduled caste', 'maintenance', 'tuition']
  },
  {
    name: "INSPIRE Scholarship (SHE - Scholarship for Higher Education)",
    description: "Scholarship for meritorious students to study natural and basic sciences at BSc and MSc levels. Part of the Innovation in Science Pursuit for Inspired Research (INSPIRE) programme.",
    minAge: 17, maxAge: 27,
    educationLevel: ['ug', 'pg'],
    category: ['all'],
    minIncome: 0, maxIncome: 10000000,
    fieldOfStudy: ['science', 'mathematics', 'engineering'],
    states: ['all'],
    benefits: [
      "₹80,000 per year scholarship",
      "₹20,000 summer research project mentorship",
      "Exposure to scientific research environment",
      "5-year support (BSc + MSc)",
      "No income criteria — purely merit-based"
    ],
    eligibility: [
      "Top 1% in Class 12 board exams",
      "JEE/NEET qualified students",
      "KVPY/Olympiad medal winners",
      "Pursuing BSc/BS/Int. MSc in natural/basic sciences",
      "Studying in recognized Indian institution"
    ],
    applicationProcess: [
      "Apply online at www.online-inspire.gov.in",
      "Upload Class 12 marksheet and admit card",
      "Select institution and course",
      "Verification by DST-INSPIRE team",
      "Scholarship disbursed annually"
    ],
    deadline: "September - November annually",
    website: "https://online-inspire.gov.in",
    scholarshipAmount: "₹80,000/year + ₹20,000 mentorship",
    ministry: "Department of Science & Technology",
    tags: ['science', 'inspire', 'research', 'merit', 'basic sciences']
  },
  {
    name: "Prime Minister's Special Scholarship Scheme (PMSSS) for J&K and Ladakh",
    description: "Scholarship for students from Jammu & Kashmir and Ladakh to pursue undergraduate courses in colleges and universities outside the UT.",
    minAge: 17, maxAge: 25,
    educationLevel: ['ug'],
    category: ['all'],
    minIncome: 0, maxIncome: 800000,
    fieldOfStudy: ['all'],
    states: ['jammu & kashmir', 'ladakh'],
    benefits: [
      "Academic fee up to ₹3 lakh/year (engineering) or ₹2 lakh (other courses)",
      "Maintenance allowance of ₹1 lakh/year",
      "Support for 5,000 students annually",
      "Covers professional and general degree courses",
      "Hostel/accommodation support"
    ],
    eligibility: [
      "Domicile of J&K or Ladakh",
      "Passed 10+2 from J&K/Ladakh board or CBSE school in UT",
      "Family income below ₹8 lakh per annum",
      "Admitted to approved institution outside J&K/Ladakh",
      "Not availing any other central scholarship"
    ],
    applicationProcess: [
      "Register on AICTE PMSSS portal",
      "Fill application and upload documents",
      "Participate in counselling rounds",
      "Get allotted institution and confirm admission",
      "Scholarship disbursed after joining"
    ],
    deadline: "April - June annually",
    website: "https://www.aicte-india.org/pmsss",
    scholarshipAmount: "Up to ₹3 Lakh tuition + ₹1 Lakh maintenance",
    ministry: "AICTE / Ministry of Education",
    tags: ['jammu kashmir', 'ladakh', 'pmsss', 'undergraduate', 'special area']
  },
  {
    name: "Maulana Azad National Fellowship (MANF)",
    description: "Fellowship for minority community students pursuing M.Phil and Ph.D. Provides financial assistance for research scholars from six notified minority communities.",
    minAge: 20, maxAge: 40,
    educationLevel: ['pg', 'phd'],
    category: ['minority'],
    minIncome: 0, maxIncome: 600000,
    fieldOfStudy: ['all'],
    states: ['all'],
    benefits: [
      "₹31,000/month for JRF (first 2 years)",
      "₹35,000/month for SRF (remaining tenure)",
      "HRA as per university norms",
      "₹10,000/year contingency for humanities",
      "₹20,500/year contingency for sciences"
    ],
    eligibility: [
      "Belongs to minority community (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)",
      "Admitted to M.Phil/Ph.D in recognized university",
      "Qualified UGC-NET/JRF or university entrance test",
      "Family income not exceeding ₹6 lakh per annum"
    ],
    applicationProcess: [
      "Apply through UGC portal during open call",
      "Submit minority community certificate",
      "Upload NET/JRF qualification and admission proof",
      "UGC evaluates and selects candidates",
      "Fellowship disbursed monthly through institution"
    ],
    deadline: "January - March annually",
    website: "https://www.ugc.ac.in",
    scholarshipAmount: "₹31,000-₹35,000/month + HRA",
    ministry: "University Grants Commission",
    tags: ['minority', 'fellowship', 'phd', 'mphil', 'research', 'maulana azad']
  },
  {
    name: "Pragati Scholarship for Girl Students (AICTE)",
    description: "AICTE scholarship scheme for girl students admitted to first year of degree/diploma in AICTE approved institutions to promote women's participation in technical education.",
    minAge: 17, maxAge: 25,
    educationLevel: ['ug', 'diploma'],
    category: ['all'],
    minIncome: 0, maxIncome: 800000,
    fieldOfStudy: ['engineering', 'technology', 'architecture', 'pharmacy'],
    states: ['all'],
    benefits: [
      "₹50,000 per year scholarship",
      "Up to ₹2,000/month (10 months) for incidentals",
      "4-year support for degree courses",
      "3-year support for diploma courses",
      "Directly credited to student's bank account"
    ],
    eligibility: [
      "Girl student admitted to 1st year degree/diploma",
      "AICTE approved institution",
      "Family income not exceeding ₹8 lakh per annum",
      "Only two girl children per family eligible",
      "Must have 75% attendance"
    ],
    applicationProcess: [
      "Apply through National Scholarship Portal (NSP)",
      "Fill in academic and personal details",
      "Upload all required documents",
      "Verification by institute and state",
      "Scholarship credited after final approval"
    ],
    deadline: "October - December annually",
    website: "https://www.aicte-india.org",
    scholarshipAmount: "₹50,000 per year",
    ministry: "AICTE",
    tags: ['girl student', 'women', 'technical education', 'aicte', 'pragati']
  },
  {
    name: "Pre-Matric Scholarship for OBC Students",
    description: "Scholarship for OBC students studying in classes 1 to 10 to support their education and prevent dropouts. Government of India centrally-sponsored scheme.",
    minAge: 6, maxAge: 18,
    educationLevel: ['school'],
    category: ['obc'],
    minIncome: 0, maxIncome: 250000,
    fieldOfStudy: ['all'],
    states: ['all'],
    benefits: [
      "₹25-₹100/month maintenance allowance (10 months)",
      "Ad-hoc grant for books and stationery",
      "Hostel maintenance for hostellers",
      "Covers Class 1 to 10 students",
      "Renewable annually on passing"
    ],
    eligibility: [
      "Belongs to OBC category",
      "Family income not exceeding ₹2.5 lakh per annum",
      "Studying in government or recognized school",
      "Must have passed previous exam",
      "Not receiving any other pre-matric scholarship"
    ],
    applicationProcess: [
      "Apply through National Scholarship Portal",
      "Upload OBC certificate, income proof",
      "Submit school admission and fee receipt",
      "Institute verification",
      "Disbursed through state government"
    ],
    deadline: "August - October annually",
    website: "https://scholarships.gov.in",
    scholarshipAmount: "₹25-₹100/month + book grant",
    ministry: "Ministry of Social Justice & Empowerment",
    tags: ['obc', 'pre-matric', 'school', 'maintenance', 'dropout prevention']
  },
  {
    name: "Ishan Uday – Special Scholarship for NE Region",
    description: "UGC scholarship for students from North Eastern states pursuing general degree courses in colleges/universities away from their home state.",
    minAge: 17, maxAge: 25,
    educationLevel: ['ug'],
    category: ['all'],
    minIncome: 0, maxIncome: 450000,
    fieldOfStudy: ['all'],
    states: ['assam', 'arunachal pradesh', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'sikkim', 'tripura'],
    benefits: [
      "₹5,400/month for general degree courses",
      "₹7,800/month for technical/professional courses",
      "10-month annual support",
      "10,000 fresh scholarships annually",
      "Study support outside home state"
    ],
    eligibility: [
      "Domicile of North Eastern state",
      "Passed 12th from NE state institution",
      "Family income not exceeding ₹4.5 lakh per annum",
      "Admitted to recognized institution",
      "Not availing any other UGC scholarship"
    ],
    applicationProcess: [
      "Apply through National Scholarship Portal (NSP)",
      "Upload domicile certificate and 12th marksheet",
      "Submit admission letter and income proof",
      "UGC verification process",
      "Scholarship disbursed through DBT"
    ],
    deadline: "October - December annually",
    website: "https://scholarships.gov.in",
    scholarshipAmount: "₹5,400 - ₹7,800/month",
    ministry: "University Grants Commission",
    tags: ['northeast', 'ne region', 'ishan uday', 'undergraduate', 'special area']
  },
  {
    name: "National Means-cum-Merit Scholarship Scheme (NMMSS)",
    description: "Provides scholarships to meritorious students from economically weaker sections to reduce dropout rate at Class 8 and encourage continuation to secondary/higher secondary.",
    minAge: 12, maxAge: 18,
    educationLevel: ['school'],
    category: ['all'],
    minIncome: 0, maxIncome: 350000,
    fieldOfStudy: ['all'],
    states: ['all'],
    benefits: [
      "₹12,000 per year (₹1,000/month)",
      "Support from Class 9 to Class 12",
      "Directly to student's bank account",
      "1 lakh scholarships awarded nationally each year",
      "Renewable based on promotion to next class"
    ],
    eligibility: [
      "Studying in Class 8 in government/aided school",
      "Minimum 55% marks in Class 7",
      "Family income below ₹3.5 lakh per annum",
      "Must qualify NMMS examination (MAT + SAT)",
      "Should be studying in state government/aided school"
    ],
    applicationProcess: [
      "Register through National Scholarship Portal",
      "Appear for NMMS exam conducted by state",
      "Submit result and qualifying documents",
      "State SNA verifies and selects candidates",
      "Scholarship disbursed from Class 9 onwards"
    ],
    deadline: "August - November annually",
    website: "https://scholarships.gov.in",
    scholarshipAmount: "₹12,000/year",
    ministry: "Ministry of Education",
    tags: ['merit', 'means', 'school', 'dropout prevention', 'class 8 to 12']
  }
];

// Export for auto-seeding from server.js
module.exports = { businessSchemes, educationSchemes };

// Run directly: node data/seed.js
if (require.main === module) {
  async function seedDatabase() {
    try {
      dotenv.config();
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB for seeding');
      await BusinessScheme.deleteMany({});
      await EducationScheme.deleteMany({});
      console.log('🗑️  Cleared existing schemes');
      await BusinessScheme.insertMany(businessSchemes);
      console.log(`✅ Seeded ${businessSchemes.length} business schemes`);
      await EducationScheme.insertMany(educationSchemes);
      console.log(`✅ Seeded ${educationSchemes.length} education schemes`);
      console.log('\n🎉 Database seeding complete!');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding error:', error);
      process.exit(1);
    }
  }
  seedDatabase();
}

