module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			// You get to make the name
			// The paths tell JSHint which files to validate
			dev: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
			options: {
				curly: false,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				forin: true,
				undef: true,
				unused: true,
				expr: true,
				globals: {
					define: false,
					require: false,
					module: true,
					expect: true,
					mocha: true,
					describe: true,
					it: true,
					beforeEach: true
				},
				reporter: require('jshint-stylish')
			},
			build: ['dist/**/*.js']
		},
		mocha: {
			dev: {
				src: ['tests/**/dev.html'],
			},
			dist: {
				src: ['tests/**/dist.html'],
			},
			options: {
				log: true,
				run: true,
				reporter: 'Spec'
			}
		},
		uglify: {
			options: {
				banner: [
					'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					'/*! <%= pkg.description %> */\n'
				].join(''),
				compress: true
			},
			dist: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha');

	grunt.registerTask('default', [
		'jshint:dev',
		'mocha:dev'
	]);

	grunt.registerTask('dist', [
		'uglify',
		'mocha:dist'
	]);
};