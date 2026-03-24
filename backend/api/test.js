module.exports = (req, res) => {
  res.json({ test: 'ok', nodeVersion: process.version });
};
