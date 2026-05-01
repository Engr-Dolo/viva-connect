export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    data: null,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
