module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>;author: wangbinbin;nickname:done;blog: newblog.tecclass.cn;company:kaixun*/\n'
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'dev/javascripts/business/',
                    src: '**/*.js',
                    dest: 'public/javascripts/business/'
                }, {
                    expand: true,
                    cwd: 'dev/javascripts/init/',
                    src: '*.js',
                    dest: 'public/javascripts/init/'
                }, {
                    expand: true,
                    cwd: 'dev/javascripts/lib/',
                    src: '*.js',
                    dest: 'public/javascripts/lib/'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dev/stylesheets/',
                    src: ['*.css'],
                    dest: 'public/stylesheets/',
                    ext: '.css'
                }]
            }
        },
        watch: {
            uglify: {
                files: ['dev/javascripts/business/**/*.js', 'dev/javascripts/init/*.js', 'dev/javascripts/lib/*.js'],
                tasks: ['uglify']
            },
            cssmin: {
                files: ['dev/stylesheets/*.css'],
                tasks: ['cssmin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('uglifybuild', ['uglify']);
    grunt.registerTask('cssminbuild', ['cssmin']);
};