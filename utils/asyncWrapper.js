module.exports = (fn) => (req, res, next) => {
    // eslint-disable-next-line
    fn(req, res, next).catch((e) => next(e));
};
