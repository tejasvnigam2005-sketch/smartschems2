// Data Quality Service — monitors database integrity, active sources,
// provenance distribution, and flagged discrepancies across government sources.

const Scheme = require('../../models/Scheme');

class DataQualityService {
  static async getQualityReport() {
    const totalSchemes = await Scheme.countDocuments();

    // Group by status
    const statusCounts = await Scheme.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byStatus = statusCounts.reduce((acc, curr) => {
      acc[curr._id || 'unspecified'] = curr.count;
      return acc;
    }, {});

    // Group by primary source
    const sourceCounts = await Scheme.aggregate([
      { $group: { _id: '$source.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const bySource = sourceCounts.map((s) => ({
      sourceName: s._id || 'Unknown',
      count: s.count,
    }));

    // Multi-source schemes
    const multiSourceCount = await Scheme.countDocuments({
      'sources.1': { $exists: true },
    });

    // Schemes requiring review (conflicts or discrepancies)
    const reviewRequired = await Scheme.find({
      $or: [{ status: 'needs_review' }, { 'discrepancies.0': { $exists: true } }],
    })
      .select('scheme_name name ministry status discrepancies source lastVerifiedAt')
      .limit(50)
      .lean();

    // Recently verified or updated schemes
    const recentlyUpdated = await Scheme.find()
      .sort({ lastVerifiedAt: -1, updatedAt: -1 })
      .select('scheme_name name ministry level schemeCategory status lastVerifiedAt source')
      .limit(10)
      .lean();

    // Completeness metrics
    const structuredAgeCount = await Scheme.countDocuments({
      $or: [
        { 'eligibility.minAge': { $ne: null } },
        { 'eligibility.maxAge': { $ne: null } },
      ],
    });

    const structuredIncomeCount = await Scheme.countDocuments({
      'eligibility.incomeLimit': { $ne: null },
    });

    const withOfficialUrlCount = await Scheme.countDocuments({
      officialUrl: { $ne: '', $exists: true },
    });

    return {
      overview: {
        totalSchemes,
        activeSchemes: byStatus['active'] || 0,
        schemesRequiringReview: byStatus['needs_review'] || reviewRequired.length,
        multiSourceCount,
      },
      statusBreakdown: byStatus,
      sourcesBreakdown: bySource,
      dataCompleteness: {
        withStructuredAge: structuredAgeCount,
        withStructuredIncome: structuredIncomeCount,
        withOfficialUrl: withOfficialUrlCount,
      },
      flaggedDiscrepancies: reviewRequired.map((doc) => ({
        id: doc._id,
        name: doc.name || doc.scheme_name,
        ministry: doc.ministry,
        source: doc.source?.name,
        status: doc.status,
        discrepancies: doc.discrepancies,
      })),
      recentlyUpdated: recentlyUpdated.map((doc) => ({
        id: doc._id,
        name: doc.name || doc.scheme_name,
        ministry: doc.ministry,
        level: doc.level,
        category: doc.schemeCategory,
        status: doc.status,
        lastVerifiedAt: doc.lastVerifiedAt,
        source: doc.source?.name,
      })),
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = DataQualityService;
