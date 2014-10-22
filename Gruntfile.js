/*jshint camelcase: false*/
<<<<<<< HEAD
// Generated on 2014-04-05 using generator-chrome-extension 0.2.5
'use strict';
var mountFolder = function (connect, dir) {
=======
// Generated on 2014-03-13 using generator-chrome-extension 0.2.5
'use strict';
var mountFolder = function(connect, dir) {
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

<<<<<<< HEAD
module.exports = function (grunt) {
=======
module.exports = function(grunt) {
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
<<<<<<< HEAD
            options: {
                spawn: false
            },
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
=======
          tpl: {
            files: ['<%= yeoman.app %>/scripts/app/templates/*.html'],
            tasks: ['html2js'],
            options: {
              spawn: false,
            }
          },
        },
        connect: {
            options: {
                hostname: 'localhost',

            },
            keepalive: {
                options: {
                    port: 9001,
                    keepalive: true,
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9000,
                    middleware: function(connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app'),
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
<<<<<<< HEAD
=======
        strip: {
          build: {
            src: '<%= yeoman.dist %>/*.js',
            options: { inline: true }
          }
        },
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },
<<<<<<< HEAD
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/scripts',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        /*uglify: {
            dist: {}
        },*/
=======
        mocha_phantomjs: {
            all: {
                options: {
                    view: "1440x900",
                    run: true,
                    log: true,
                    logErrors: true,
                    urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    log: true,
                    logErrors: true,
                    urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
                }
            }
        },
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: [
<<<<<<< HEAD
                '<%= yeoman.app %>/popup.html',
                '<%= yeoman.app %>/options.html'
            ]
        },
=======
                '<%= yeoman.app %>/recorder.html',
                '<%= yeoman.app %>/messenger.html'
            ]
        },
        html2js: {
            options: {
                base: '../recorder/app/'
            },
            main: {
                src: ['<%= yeoman.app %>/scripts/app/templates/*.html'],
                dest: '<%= yeoman.app %>/scripts/app/modules/templates.js'
            },
        },
        uglify: {
            options: {
                mangle: false
            },
            recorder: {
                src: [
                    "<%= yeoman.app %>/bower_components/jquery/dist/jquery.min.js",
                    "<%= yeoman.app %>/scripts/chance.js",
                    "<%= yeoman.app %>/bower_components/cssesc/cssesc.js",
                    "<%= yeoman.app %>/scripts/dom_helper.js",
                    "<%= yeoman.app %>/scripts/selector.js",
                    "<%= yeoman.app %>/scripts/recorder.js",
                    "<%= yeoman.app %>/scripts/contentscript_selector.js",
                    "<%= yeoman.app %>/scripts/contentscript_recorder.js"
                ],
                dest: '<%= yeoman.dist %>/contentscript.js'
            },
            bbext: {
                src: [
                    "<%= yeoman.app %>/scripts/contentscript-bb.js"
                ],
                dest: '<%= yeoman.dist %>/contentscript-bb.js'
            }
        },
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
<<<<<<< HEAD
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
=======
            css: ['<%= yeoman.dist %>/{,*/}*.css']
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
<<<<<<< HEAD
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
=======
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/selector.css': [
                        '<%= yeoman.app %>/css/selector.css'
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
<<<<<<< HEAD
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.{webp,gif}',
                        '_locales/{,*/}*.json'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
            }
        },
        concurrent: {
            server: [
                'coffee:dist',
                'compass:server'
            ],
            test: [
                'coffee',
                'compass'
            ],
            dist: [
                'coffee',
                'compass:dist',
                'imagemin',
                'svgmin',
                'htmlmin'
=======
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            'fonts/**/*',
                            'images/{,*/}*.{webp,gif}',
                            '_locales/{,*/}*.json'
                        ]
                    },
                    /*{
                    expand: true,
                    dest: '<%= yeoman.dist %>/scripts/app/templates',
                    cwd: '<%= yeoman.app %>/scripts/app/templates/',
                    src: [
                        '*.html'
                    ]
                }, */
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/bower_components/bootstrap/fonts/',
                        dest: '<%= yeoman.dist %>/fonts',
                        src:['*'],
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    }, {
                        expand: false,
                        dest: '<%= yeoman.dist %>/manifest.json',
                        src: [
                            '<%= yeoman.app %>/manifest-dist.json'
                        ]
                    }
                ]
            }
        },
        concurrent: {
            dist: [
                'imagemin',
                'htmlmin',
                'cssmin'
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
            ]
        },
        chromeManifest: {
            dist: {
                options: {
<<<<<<< HEAD
                    buildnumber: true,
                    background: {
                        target:'scripts/background.js'
=======
                    buildnumber: false,
                    background: {
                        target: 'messager.html'
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
                    }
                },
                src: '<%= yeoman.app %>',
                dest: '<%= yeoman.dist %>'
            }
        },
        compress: {
            dist: {
                options: {
<<<<<<< HEAD
                    archive: 'package/Jawbone-Chrome.zip'
=======
                    archive: 'package/BugBuster Selector.zip'
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
<<<<<<< HEAD
        }
=======
        },
        preprocess : {
            options: {
                inline: true,
                context : {
                    DEBUG: false
                }
            },
            js : {
                src: '<%= yeoman.app %>/scripts/analytics.js'
            }
        },
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
    });

    grunt.registerTask('test', [
        'clean:server',
<<<<<<< HEAD
        'concurrent:test',
=======
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
        'connect:test',
        'mocha'
    ]);

<<<<<<< HEAD
    grunt.registerTask('build', [
        'clean:dist',
        'chromeManifest:dist',
        'useminPrepare',
        'concurrent:dist',
        'cssmin',
        'concat',
        'uglify',
        'copy',
        'usemin',
        'compress'
    ]);

    grunt.registerTask('js', [
        'jshint'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
=======
    grunt.registerTask('dev', [
        'html2js',
        'watch:tpl'
    ]);

    grunt.registerTask('build', [
        'test',
        'clean:dist',
        // 'preprocess:js',
        'html2js',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'uglify',
        'copy',
        'strip',
        'usemin'
    ]);

    grunt.registerTask('default', [
        // 'jshint',
        'test',
        'dev'
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
    ]);
};
