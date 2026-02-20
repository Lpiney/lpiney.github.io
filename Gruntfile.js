module.exports = function(grunt) {

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        // JavaScript 压缩配置
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                compress: {
                    drop_console: true // 删除console.log
                }
            },
            build: {
                files: {
                    'js/hux-blog.min.js': [
                        'js/jquery.min.js',
                        'js/bootstrap.min.js',
                        'js/jquery.nav.js',
                        'js/archive.js',
                        'js/simple-jekyll-search.min.js',
                        'js/snackbar.js',
                        'js/dark-mode.js',
                        'js/language.js'
                    ]
                }
            }
        },
        
        // LESS 编译配置
        less: {
            expanded: {
                options: {
                    paths: ["css"],
                    sourceMap: true,
                    sourceMapFilename: 'css/bruce-blog.css.map'
                },
                files: {
                    "css/bruce-blog.css": "less/bruce-blog.less"
                }
            },
            minified: {
                options: {
                    paths: ["css"],
                    cleancss: true,
                    sourceMap: true,
                    sourceMapFilename: 'css/bruce-blog.min.css.map'
                },
                files: {
                    "css/bruce-blog.min.css": "less/bruce-blog.less"
                }
            }
        },
        
        // 添加版权横幅
        banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['css/bruce-blog.css', 'css/bruce-blog.min.css', 'js/hux-blog.min.js']
                }
            }
        },
        
        // 文件监控
        watch: {
            scripts: {
                files: ['js/*.js', '!js/hux-blog.min.js'],
                tasks: ['uglify', 'usebanner'],
                options: {
                    spawn: false,
                },
            },
            less: {
                files: ['less/*.less'],
                tasks: ['less', 'usebanner'],
                options: {
                    spawn: false,
                }
            },
        },
    });

    // 加载插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 注册任务
    grunt.registerTask('default', ['less', 'uglify', 'usebanner']);
    grunt.registerTask('build', ['less', 'uglify', 'usebanner']);
    grunt.registerTask('dev', ['watch']);

};