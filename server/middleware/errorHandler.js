const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err);

  // Handle MySQL Duplicate Entry Errors (Error code 1062)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with this unique value (e.g. email or name) already exists.'
    });
  }

  // Handle MySQL Foreign Key Constraint Errors (Error code 1451, 1452)
  if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Foreign key constraint error. Referenced record does not exist or is in use.'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
