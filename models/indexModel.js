module.exports = function(http){
   mvc.model.apply(this, arguments);
   this.parent = mvc.model;
}
module.exports.prototype = Object.create(mvc.model.prototype);
module.exports.constructor = module.exports;