module.exports = function(grunt) {

    var readAWS = function() {
        if (grunt.file.exists('./aws-keys.json')) {
            return grunt.file.readJSON('./aws-keys.json');
        }
        return;
    }

    grunt.initConfig({
        aws: readAWS(),
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'wordpress-core-plugin/assets',
                    src: ['*'],
                    dest: 'wordpress-core-plugin/assets'
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['wordpress-core-plugin/**', 'padsquad.php', 'ps_extras.php', 'plugin-updates/**'],
                    dest: 'bld/'
                }]
            }
        },
        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AWSAccessKeyId %>',
                secretAccessKey: '<%= aws.AWSSecretKey %>',
                region: '<%= aws.region %>',
                bucket: 'asset.padsquad.com',
                uploadConcurrency: 5,
                differential: true,
                displayChangesOnly: true,
                gzip: false,
                debug: false
            },
            production: {
                files: [{
                    expand: false,
                    src: ['padsquad.zip'],
                    dest: 'wpplugin/stable.zip',
                    params: {
                        ContentType: 'application/zip',
                        ContentEncoding: 'gzip',
                        CacheControl: 'no-cache'
                    }
                }]
            }
        },
        compress: {
            options:{
                archive: "padsquad.zip"
            },
            main: {
                expand: true,
                cwd: 'bld',
                src: ['./**'],
                dest: './'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-aws-s3-gzip');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', ['Building wordpress'], function() {
        grunt.file.delete("./bld", [{
            force: true
        }]);

        grunt.task.run('copy:main');
        grunt.task.run('compress:main');
        grunt.task.run('aws_s3:production');
    });
};
