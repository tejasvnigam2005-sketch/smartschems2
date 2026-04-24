const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

router.use((req, res, next) => {
  if (!supabase) return res.status(503).json({ message: 'Database not configured.' });
  next();
});

// GET /api/education-schemes
router.get('/', async (req, res) => {
  try {
    const { educationLevel, category, state, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase.from('education_schemes').select('*', { count: 'exact' }).eq('is_active', true);

    if (educationLevel) query = query.contains('education_level', [educationLevel]);
    if (category) query = query.contains('category', [category]);
    if (state) query = query.contains('states', [state.toLowerCase()]);

    query = query.order('created_at', { ascending: false }).range(offset, offset + Number(limit) - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    res.json({
      schemes: data || [],
      pagination: {
        total: count || 0,
        page: Number(page),
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Education schemes error:', error);
    res.status(500).json({ message: 'Server error fetching education schemes' });
  }
});

// GET /api/education-schemes/:id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('education_schemes').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ message: 'Scheme not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
