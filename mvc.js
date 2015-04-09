// Model
module.exports.model = function(http){
   this.req = http.req;
   this.res = http.res;
}
// View
module.exports.view = function(model){
   this.model     = model;
   this.styles    = new Array();
   this.scripts   = new Array();
   this.locals    = this.model.res.locals;
   this.jade      = 'default';
   this.pageTitle = 'SBSlord-Project';
}
module.exports.view.prototype.output = function(){
   this.locals.pageTitle = this.pageTitle;
   this.locals.styles    = this.styles;
   this.locals.scripts   = this.scripts;
   var html = require('jade').compileFile('jade/' + this.jade + '.jade', {pretty: true})(this.locals);
   this.model.res.writeHead(200, {'Content-Type': 'text/html'});
   this.model.res.end(html);
}
module.exports.view.prototype.setStyle = function(style){
   if(style.indexOf('http://') != -1){
      this.styles.push(style);
   }else{
      this.styles.push('styles/' + style + '.css');
   }
}
// Controller
module.exports.controller = function(model, view){
   this.model = model;
   this.view  = view;
}
module.exports.controller.prototype.login = function(){
   
}
// Route
module.exports.route = function(routeName, model, view, controller){
   this.routeName  = routeName;
   this.model      = model;
   this.view       = view;
   this.controller = controller;
}
// Router
module.exports.router = function(routes){
   this.routes = routes || Object.create(null);
   this.routes.default = new module.exports.route('model', 'view', 'controller');
}
module.exports.router.prototype.getRoute = function(route){
   if(this.routes.hasOwnProperty(route)){
      return this.routes[route];
   }
   return this.routes.default;
}
// FrontController
module.exports.frontController = function(http, router, routeName){
   this.http      = http;
   this.router    = router;
   this.routeName = routeName;
   this.route     = this.router.getRoute(this.routeName);
   //Model
   if(node.fs.existsSync(myRequire.root.models.fullPath(this.route.model + '.js'))){
      this.model = new (myRequire.root.models.require(this.route.model + '.js'))(this.http);
   }else{
      this.model = new module.exports.model(this.http);
   }
   //View
   if(node.fs.existsSync(myRequire.root.views.fullPath(this.route.view + '.js'))){
      this.view = new (myRequire.root.views.require(this.route.view + '.js'))(this.model);
   }else{
      this.view = new module.exports.view(this.model);
   }
   // Set default config
   this.view.setStyle('default');
   //Controller
   if(node.fs.existsSync(myRequire.root.controllers.fullPath(this.route.controller + '.js'))){
      this.controller = new (myRequire.root.controllers.require(this.route.controller + '.js'))(this.model, this.view);
   }else{
      this.controller = new module.exports.controller(this.model, this.view);
   }
}
module.exports.frontController.prototype.output = function(){
   this.view.output();
}