// Ingestion Scheme Validator — validates normalized scheme objects using Zod.
// Enforces data correctness, security constraints, and prevents invalid or malicious payloads.

const { z } = require('zod');

// Allowed government domains for source and official links
const ALLOWED_GOV_DOMAINS = [
  'gov.in',
  'nic.in',
  'data.gov.in',
  'api.data.gov.in',
  'myscheme.gov.in',
  'india.gov.in',
  'digitalindia.gov.in',
  'mygov.in',
  'ibps.in',
  'nta.ac.in',
  'aicte-india.org',
  'ugc.ac.in',
  'esic.gov.in',
  'epfindia.gov.in',
];

// Anti-SSRF URL validator: ensures URL is well-formed, uses http/https, and does not target private IPs
function isSafeUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') return true;
  const trimmed = urlString.trim();
  if (!trimmed) return true;

  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    const hostname = parsed.hostname.toLowerCase();

    // Block private/loopback/metadata addresses
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '169.254.169.254' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

const safeUrlSchema = z
  .string()
  .nullish()
  .refine(
    (url) => !url || isSafeUrl(url),
    { message: 'URL must be a valid public HTTP/HTTPS URL and not point to private network addresses' }
  );

const structuredEligibilitySchema = z
  .object({
    rawText: z.string().default(''),
    minAge: z.number().int().min(0).max(120).nullable().default(null),
    maxAge: z.number().int().min(0).max(120).nullable().default(null),
    incomeLimit: z.number().min(0).nullable().default(null),
    incomePeriod: z.enum(['annual', 'monthly']).nullable().default(null),
    incomeType: z.enum(['family', 'individual']).nullable().default(null),
    gender: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    educationLevels: z.array(z.string()).default([]),
    occupations: z.array(z.string()).default([]),
    businessTypes: z.array(z.string()).default([]),
    states: z.array(z.string()).default([]),
    districts: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.minAge !== null && data.maxAge !== null) {
        return data.minAge <= data.maxAge;
      }
      return true;
    },
    { message: 'minAge cannot be greater than maxAge' }
  );

const normalizedSchemeSchema = z.object({
  name: z.string().min(2, 'Scheme name must have at least 2 characters'),
  scheme_name: z.string().optional(),
  slug: z.string().optional(),
  shortDescription: z.string().default(''),
  description: z.string().default(''),
  details: z.string().default(''),
  ministry: z.string().default(''),
  department: z.string().default(''),
  schemeType: z.string().default(''),
  level: z.string().default('Central'),
  schemeCategory: z.string().default('General'),
  tags: z.array(z.string()).default([]),
  eligibility: structuredEligibilitySchema.default({}),
  benefits: z.array(z.string()).default([]),
  benefitsList: z.array(z.string()).default([]),
  documentsRequired: z.array(z.string()).default([]),
  applicationProcess: z.string().default(''),
  applicationUrl: safeUrlSchema.default(''),
  officialUrl: safeUrlSchema.default(''),
  source: z.object({
    name: z.string().min(1, 'Source name is required'),
    url: safeUrlSchema.default(''),
    datasetId: z.string().nullable().default(null),
    retrievedAt: z.date().or(z.string()).default(() => new Date()),
  }),
  status: z.enum(['active', 'inactive', 'needs_review', 'archived']).default('active'),
  lastVerifiedAt: z.date().or(z.string()).default(() => new Date()),
  ingestionMetadata: z
    .object({
      sourceIdentifier: z.string().optional(),
      contentHash: z.string().optional(),
      isLLMProcessed: z.boolean().default(false),
      llmModel: z.string().nullable().default(null),
    })
    .default({}),
});

function validateNormalizedScheme(data) {
  const result = normalizedSchemeSchema.safeParse(data);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      data: null,
    };
  }
  return {
    valid: true,
    data: result.data,
    errors: [],
  };
}

module.exports = {
  normalizedSchemeSchema,
  validateNormalizedScheme,
  isSafeUrl,
  ALLOWED_GOV_DOMAINS,
};
