

module.exports = (fn) => {
  return (req, res) => {
    fn(req, res).catch(err => {
      next(err);
    });
  };      
};
