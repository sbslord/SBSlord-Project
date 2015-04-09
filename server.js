// [SBSlord-project]
global.myRequire = new require('./my_require.js');
global.node = new function(){
   this.http    = require('http');
   this.express = require('express');
   this.config  = myRequire.root.config.require('node.js');
   this.jade    = require('jade');
   this.fs      = require('fs');
   this.knex    = require('knex')({
      client: 'mysql',
      connection: {
         host     : 'localhost',
         user     : 'root',
         password : '',
         database : 'sbslord-project'
      }
   });
   this.session  = require('express-session');
   this.KnexSessionStore = require('connect-session-knex')(this.session);
   this.myStore = new this.KnexSessionStore({
      knex: this.knex,
      tablename: 'sessions'
   });
}
var app = node.express();
app.use(node.session({
   resave: false,
   saveUninitialized: true,
   store: node.myStore,
   secret: 'your secret',
   cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));
var onlineServer = node.http.Server(app);
var offlineServer = node.http.Server(app);
global.mvc = myRequire.root.require('mvc.js');
/* knex.select().table('proba')
   .then(function(rows) {
      console.log(rows);
   }).catch(function(error) {
      console.error(error)
   }); */

//Routes
var routes = new function(){
   var routes = myRequire.root.config.require('routes.json');
   for(key in routes){
      this[key] = new mvc.route(key, routes[key][0], routes[key][1], routes[key][2]);
   }
   this['']   = this.index;
}
//Router
var router = new mvc.router(routes);

app.get('*', function(req, res){
   var GET = req.url.split('/');
   GET.splice(0, 1);
   if(routes.hasOwnProperty(GET[0])){
      var frontController = new mvc.frontController({req: req, res: res}, router, GET[0]);
      frontController.output();
   }else{
      res.status(404);
      res.send('Ez az oldal nem létezik!!!' + GET[0]);
   }
});

onlineServer.listen(node.config.server.online.port, node.config.server.online.ip);
offlineServer.listen(node.config.server.offline.port, node.config.server.offline.ip);
console.log('Szerver fut! :)');