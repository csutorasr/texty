module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['Gruntfile.js', 'src/**/*.js', 'tmp/texty.js']
        },
        uglify: {
            options: {
                banner: '/**\n * @license Texty v<%= pkg.version %>\n * (c) 2017 <%= pkg.author %>\n * License: <%= pkg.version %>\n */\n'
            },
            build: {
                files: {
                    'build/texty.min.js': 'tmp/texty.js'
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js','gruntfile.js'],
                tasks: ['deploy'],
                options: {
                    spawn: false,
                },
            },
        },
        clean: {
            build: ['build'],
            tmp: ['tmp']
        },
        concat: {
            options: {
                separator: '',
            },
            dist: {
                src: ['src/texty.prefix', 'src/**/*.js', 'src/texty.suffix'],
                dest: 'tmp/texty.js',
            },
        },
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('deploy', ['clean', 'concat', 'jshint', 'uglify']);
};