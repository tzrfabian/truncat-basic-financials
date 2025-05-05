function errorHandler(res, status = 500, message = 'Internal Server Error') {
  console.error("🚀 ~ Error:", message);
  res.status(status).json({ status, message });
}

module.exports = errorHandler;