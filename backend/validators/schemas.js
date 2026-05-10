// Zod validation schemas — centralized input validation for all API endpoints.
// Each schema validates req.body or req.query before business logic runs.

const { z } = require('zod');

// ── Helper ───────────────────────────────────
function formatZodError(zodError) {
  return zodError.issues
    .map((issue) => {
      const path = issue.path.length ? `${issue.path.join('.')}: ` : '';
      return `${path}${issue.message}`;
    })
    .join(', ');
}

// ── Auth schemas ─────────────────────────────
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password must be at most 128 characters'),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the Terms & Conditions' }) }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required').max(128, 'Password must be at most 128 characters'),
});

// ── Chat schema ──────────────────────────────
const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(500, 'Message must be at most 500 characters'),
  language: z.enum(['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa'], {
    errorMap: () => ({ message: 'Language must be one of: en, hi, ta, te, bn, mr, gu, kn, ml, pa' }),
  }).optional().default('en'),
  userProfile: z.object({
    age: z.number().int().min(1).max(120).optional(),
    income: z.number().min(0).optional(),
    state: z.string().max(50).optional(),
  }).optional(),
});

// ── Eligibility schema ───────────────────────
const eligibilitySchema = z.object({
  age: z.number({ required_error: 'Age is required' }).int().min(1, 'Age must be at least 1').max(120, 'Age must be at most 120'),
  income: z.number({ required_error: 'Income is required' }).min(0, 'Income must be at least 0'),
  state: z.string({ required_error: 'State is required' }).max(100, 'State must be at most 100 characters'),
  category: z.string({ required_error: 'Category is required' }).max(50, 'Category must be at most 50 characters'),
  occupation: z.string().max(100, 'Occupation must be at most 100 characters').optional(),
  gender: z.string().max(20, 'Gender must be at most 20 characters').optional(),
  area: z.string().max(20, 'Area must be at most 20 characters').optional(),
  disability: z.boolean().optional(),
});

// ── Recommend schema ─────────────────────────
const recommendSchema = z.object({
  category: z.enum(['business', 'education'], {
    errorMap: () => ({ message: 'Category must be "business" or "education"' }),
  }),
  filters: z.object({
    businessType: z.string().max(50).optional(),
    educationLevel: z.string().max(50).optional(),
    category: z.string().max(50).optional(),
    fieldOfStudy: z.string().max(50).optional(),
    state: z.string().max(100).optional(),
    income: z.number().min(0).optional(),
    age: z.number().int().min(1).max(120).optional(),
    investment: z.number().min(0).optional(),
    keywords: z.string().max(200).optional(),
  }),
});

// ── Pagination schema (query params come as strings) ─
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').optional().default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(50, 'Limit must be at most 50').optional().default(10),
});

module.exports = {
  formatZodError,
  signupSchema,
  loginSchema,
  chatSchema,
  eligibilitySchema,
  recommendSchema,
  paginationSchema,
};
