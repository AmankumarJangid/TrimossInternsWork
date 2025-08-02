const parseJsonFields = (req, res, next) => {
  const fieldsToParse = [
    'description',
    'dimensions',
    'pricing',
    'inventory',
    'supplier',
    'colorVariants',
    'dynamicAttributes',
    'categories'
  ];

  for (const field of fieldsToParse) {
    if (req.body[field]) {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (e) {
        return res.status(400).json({ error: `Invalid JSON in field: ${field}` });
      }
    }
  }

  next();
};

export default parseJsonFields;
