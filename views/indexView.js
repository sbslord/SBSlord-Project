module.exports = function(model){
   mvc.view.apply(this, arguments);
   this.parent = mvc.view;
   this.jade = 'index';
   this.pageTitle = 'Főoldal/' + this.pageTitle;
}
module.exports.prototype = Object.create(mvc.view.prototype);
module.exports.constructor = module.exports;