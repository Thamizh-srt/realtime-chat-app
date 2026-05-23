export const golbalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    if (err.isOperational) {
        return res.status(err.statusCode).json({ 
            error: err.message 
        })
    }

    // For non-operational errors, log them and return generic error
    console.error('Unhandled Error:', err);
    return res.status(err.statusCode).json({ 
        error: 'Something went wrong. Please try again later.' 
    })
}

export const notFound = (req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
};