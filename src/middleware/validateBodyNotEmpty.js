module.exports = (req, res, next) => {

    if (!req.body) {
      return res.status(400).json({
        error: 'Request body cannot be empty',
      });
    }

    next();
};
