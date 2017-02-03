module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            src: {
                options: {
                    reporter: require('jshint-stylish')
                },
                build: ['Gruntfile.js', 'src/**/*.js']
            },
            adapters: {
                options: {
                    reporter: require('jshint-stylish')
                },
                build: ['adapters/*.js']
            },
            examples: {
                options: {
                    reporter: require('jshint-stylish')
                },
                build: ['examples/*.js']
            }
        },
        uglify: {
            texty: {
                options: {
                    banner: '/**\n * @license Texty v<%= pkg.version %>\n * (c) 2017 <%= pkg.author %>\n * License: <%= pkg.version %>\n */\n',
                    preserveComments: 'some'
                },
                files: {
                    'build/texty.min.js': 'tmp/texty.js',
                }
            },
            rangy: {
                options: {
                    preserveComments: 'some'
                },
                files: {
                    'build/rangy.min.js': ['node_modules/rangy/lib/rangy-core.js','node_modules/rangy/lib/rangy-classapplier.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js', 'gruntfile.js'],
                tasks: ['build'],
                options: {
                    spawn: false,
                }
            },
            adapters: {
                files: ['adapters/*.js'],
                tasks: ['jshint:adapters'],
                options: {
                    spawn: false,
                }
            },
            examples: {
                files: ['examples/*.js'],
                tasks: ['jshint:examples'],
                options: {
                    spawn: false,
                }
            }
        },
        clean: {
            build: ['build'],
            tmp: ['tmp']
        },
        concat: {
            options: {
                separator: '',
            },
            texty: {
                src: ['src/texty.prefix', 'src/**/*.js', 'src/texty.suffix'],
                dest: 'tmp/texty.js',
            }
        },
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('deploy', ['build', 'uglify:rangy']);
    grunt.registerTask('build', ['concat', 'jshint:src', 'uglify:texty']);
};