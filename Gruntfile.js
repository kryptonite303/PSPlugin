module.exports = function(grunt) {

    var readAWS = function() {
        if (grunt.file.exists('./aws-keys.json')) {
            return grunt.file.readJSON('./aws-keys.json');
        }
        return;
    }

    var updateJson = (function(){
        var padsquadFile = grunt.file.read("./padsquad.php");
        var version = padsquadFile.match(/Version:.+\d/);
        var version = version[0].replace("Version: ", "");

        var updateJson = {
            "name": "Padsquad",
            "slug": "padsquad",
            "download_url": "http://asset.padsquad.com/wpplugin/stable.zip",
            "version": version,
            "author": "John Chen",
            "sections": {
                "description": "Padsquad Plugin"
            }
        }

        grunt.file.write("update.json", JSON.stringify(updateJson));

        return updateJson;
    })();

    grunt.initConfig({
        aws: readAWS(),
        updateJson: updateJson,
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
                    dest: 'wpplugin/padsquad_<%= updateJson.version %>.zip',
                    params: {
                        ContentType: 'application/zip',
                        CacheControl: 'no-cache'
                    }
                },
                {
                    expand: false,
                    src: ['update.json'],
                    dest: 'wpplugin/update.json',
                    params: {
                        ContentType: 'application/json',
                        CacheControl: 'no-cache'
                    }
                }]
            }
        },
        compress: {
            options: {
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
