const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
      });
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
      });
    }
  };
};

module.exports = {
  validateRequest,
  validateQuery,
};
