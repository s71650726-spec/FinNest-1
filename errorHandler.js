export default function errorHandlerMiddleware(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      details: err.details || null
    }
  });
}
