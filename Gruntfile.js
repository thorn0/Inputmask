const webpackConfig = require("./webpack.config");

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: ["dist"],
    bump: {
      options: {
        files: ["package.json"],
        updateConfigs: ["pkg"],
        commit: false,
        createTag: false,
        push: false,
        prereleaseName: "beta"
      }
    },
    karma: {
      options: {
        configFile: "karma.conf.js"
      },
      unit: {
        singleRun: true
      }
    },
    eslint: {
      target: "lib/*.js"
    },
    availabletasks: {
      tasks: {
        options: {
          filter: "exclude",
          tasks: ["availabletasks", "default"],
          showTasks: ["user"]
        }
      }
    },
    webpack: {
      main: webpackConfig({ env: { production: true } })[0],
      jquery: webpackConfig({ env: { production: true } })[1],
      colormask: webpackConfig({ env: { production: true } })[2]
    },
    copy: {
      extensions: {
        files: [
          {
            src: "lib/bindings/inputmask.binding.js",
            dest: "dist/bindings/inputmask.binding.js"
          },
          {
            src: "lib/bindings/inputmask.es6.js",
            dest: "dist/inputmask.es6.js"
          },
          { src: "lib/extensions/colormask.css", dest: "dist/colormask.css" },
          {
            src: "Changelog.md",
            dest: "inputmask-pages/src/assets/Changelog.md"
          }
        ]
      }
    }
  });

  // Load the plugin that provides the tasks.
  require("load-grunt-tasks")(grunt);

  grunt.registerTask("validate", ["webpack", "copy", "eslint", "karma"]);
  grunt.registerTask("dist", ["clean", "webpack", "copy"]);
  grunt.registerTask("build", ["bump:prerelease", "clean", "webpack", "copy"]);
  grunt.registerTask("build:patch", ["bump:patch", "clean", "webpack", "copy"]);
  grunt.registerTask("build:minor", ["bump:minor", "clean", "webpack", "copy"]);
  grunt.registerTask("build:major", ["bump:major", "clean", "webpack", "copy"]);
  grunt.registerTask("default", ["availabletasks"]);
};
