String.prototype.contains = function (message: string): boolean {
  return this.toLowerCase().indexOf(message) > -1;
};

module.exports = [String.prototype.contains];
