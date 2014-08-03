module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Tasks
  grunt.registerTask('default', ['jshint', 'build']);
  grunt.registerTask('build', ['clean', 'html2js', 'cssmin', 'concat', 'copy:assets']);
  grunt.registerTask('release', ['clean', 'html2js', 'cssmin', 'uglify', 'jshint', 'concat:index', 'copy:assets']);

  // Print time
  grunt.registerTask('timestamp', function () {
    grunt.log.subhead(Date());
  });

  grunt.initConfig({
    distDir: 'dist',

    vendor: {
      js: 'vendor/js',
      css: 'vendor/css'
    },

    pkg: grunt.file.readJSON('package.json'),

    src: {
      js: ['src/**/*.js'],
      css: ['src/css/**/*.css'],
      jsTempDir: ['<%= distDir %>/templates/**/*.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      }
    },

    clean: ['<%= distDir %>/*'],

    copy: {
      assets: {
        files: [
          { dest: '<%= distDir %>', src: '**', expand: true, cwd: 'src/assets/' }
        ]
      }
    },

    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= distDir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= src.tpl.common %>'],
        dest: '<%= distDir %>/templates/common.js',
        module: 'templates.common'
      }
    },

    concat: {
      dist: {
        src: ['<%= src.js %>', '<%= src.jsTempDir %>'],
        dest: '<%= distDir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distDir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src: [
          '<%= vendor.js %>/angular/**/*.js',
          '<%= vendor.js %>/angular-modules/**/*.js',
          '<%= src.jsTempDir %>'
        ],
        dest: '<%= distDir %>/angular.js'
      },
      bootstrap: {
        src: ['<%= vendor.js %>/angular-ui/**/*.js'],
        dest: '<%= distDir %>/bootstrap.js'
      },
      jquery: {
        src: ['<%= vendor.js %>/jquery/**/*.js'],
        dest: '<%= distDir %>/jquery.js'
      }
    },

    uglify: {
      dist: {
        src: ['<%= src.js %>' , '<%= src.jsTempDir %>'],
        dest: '<%= distDir %>/<%= pkg.name %>.js'
      },
      angular: {
        src: ['<%= concat.angular.src %>'],
        dest: '<%= distDir %>/angular.js'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.src %>'],
        dest: '<%= distDir %>/bootstrap.js'
      },
      jquery: {
        src: ['<%= concat.jquery.src %>'],
        dest: '<%= distDir %>/jquery.js'
      }
    },

    jshint: {
      files: ['gruntFile.js', '<%= src.js %>', '<%= src.jsTempDir %>'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        globals: {}
      }
    },

    cssmin: {
      utrc: {
        files: {
          '<%= distDir %>/<%= pkg.name %>.css': ['<%= vendor.css %>/**/*.css', '<%= src.css %>']
        }
      }
    },

    watch:{
      build: {
        files:['<%= src.js %>', '<%= src.css %>', '<%= src.tpl.app %>', '<%= src.tpl.common %>', '<%= src.html %>'],
        tasks:['build','timestamp']
      }
    }

  });
};