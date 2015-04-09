require_create = function(path, parent){
   this.path = path;
   this.parent = parent || '';
}
require_create.prototype.require = function(file){
   return require(this.parent + this.path + file);
}
require_create.prototype.fullPath = function(file){
   return this.parent + this.path + file;
}
module.exports = new function(){
   this.root = new require_create(__dirname + '/');
   this.root.config = new require_create('config/', this.root.path);
   this.root.models = new require_create('models/', this.root.path);
   this.root.views = new require_create('views/', this.root.path);
   this.root.controllers = new require_create('controllers/', this.root.path);
};