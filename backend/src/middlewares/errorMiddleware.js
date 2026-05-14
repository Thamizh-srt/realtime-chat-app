export const golbalErrorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({ error: err.message })
    }
}

export const notFound = (req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
};