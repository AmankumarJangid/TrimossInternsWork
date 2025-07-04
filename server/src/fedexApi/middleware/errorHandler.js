const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error.message.includes('authentication failed')) {
    statusCode = 401;
    message = 'FedEx API authentication failed';
  } else if (error.message.includes('Rate calculation failed')) {
    statusCode = 400;
    message = error.message;
  } else if (error.message.includes('Shipment creation failed')) {
    statusCode = 400;
    message = error.message;
  } else if (error.message.includes('Tracking failed')) {
    statusCode = 404;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export default errorHandler;