module.exports = function(grunt) {
   grunt.initConfig({
      less: {
         development: {
            options: {
               paths: ["assets/css"]
            },
            files: {
               'www/styles/default.css': 'less/default.less'
            }
         }/*,
            production: {
            options: {
               paths: ["assets/css"],
               cleancss: true
            },
            files: {"path/to/result.css": "path/to/source.less"}
         } */
      }
   });
   grunt.loadNpmTasks('grunt-contrib-less');
   grunt.registerTask('default', ['less']);
};