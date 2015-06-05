module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			// You get to make the name
			// The paths tell JSHint which files to validate
			all: ['Gruntfile.js', 'src/**/*.js'],
			options: {
				curly: false,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				forin: true,
				undef: true,
				unused: true,
				globals: {
					define: false,
					require: false,
					requirejs: true,
					module: true,
					guid: false,
					random: false,
					uneven: false,
					console: false
				},
				reporter: require('jshint-stylish')
			}
		},
		mocha: {
			test: {
				src: ['tests/**/*.html'],
			},
			options: {
				log: true,
				run: true,
				reporter: 'Spec'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha');

	grunt.registerTask('default', [
		'jshint',
		'mocha'
	]);
};