module.exports = function(grunt) {

  grunt.initConfig({
    protractor: {
    options: {
      configFile: "conf.js", // Default config file
      keepAlive: true, // If false, the grunt process stops when the test fails.
      noColor: false, // If true, protractor will not use colors in its output.
      args: {
        'browser': 'chrome'
      }
    },
  },
  });

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  // grunt.registerTask('default', ['uglify']);


  grunt.loadNpmTasks('grunt-protractor-runner');



  grunt.registerTask('test', ['protractor']);

};