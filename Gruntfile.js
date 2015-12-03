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
            "download_url": "http://asset.padsquad.com/wpplugin/beta/padsquad.zip",
            "version": version,
            "author": "John Chen",
            "sections": {
                "description": "Padsquad Plugin release"
            }
        }

        grunt.file.write("update_beta.json", JSON.stringify(updateJson));

        return updateJson;
    })();

    var updateJsonStable = (function(){
        var padsquadFile = grunt.file.read("./padsquad.php");
        var version = padsquadFile.match(/Version:.+\d/);
        var version = version[0].replace("Version: ", "");

        var updateJsonStable = {
            "name": "Padsquad",
            "slug": "padsquad",
            "download_url": "http://asset.padsquad.com/wpplugin/stable/padsquad.zip",
            "version": version,
            "author": "John Chen",
            "sections": {
                "description": "Padsquad Plugin stable release"
            }
        }

        grunt.file.write("update.json", JSON.stringify(updateJsonStable));

        return updateJsonStable;
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
                    src: ['wordpress-core-plugin/assets/**', 'wordpress-core-plugin/templates/**','wordpress-core-plugin/comments.php', 'wordpress-core-plugin/functions.php', 'wordpress-core-plugin/header.php', 'wordpress-core-plugin/padsquad.php', 'wordpress-core-plugin/ps_filters.php', 'wordpress-core-plugin/ps_info_filter.php', 'wordpress-core-plugin/ps_settings.php', 'wordpress-core-plugin/sidebar-ps.php', 'wordpress-core-plugin/functions.php', 'padsquad.php', 'ps_extras.php', 'plugin-updates/**', 'header_info.php'],
                    dest: 'bld/'
                }]
            },
            stable: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['wordpress-core-plugin/assets/**', 'wordpress-core-plugin/templates/**','wordpress-core-plugin/comments.php', 'wordpress-core-plugin/functions.php', 'wordpress-core-plugin/header.php', 'wordpress-core-plugin/padsquad.php', 'wordpress-core-plugin/ps_filters.php', 'wordpress-core-plugin/ps_info_filter.php', 'wordpress-core-plugin/ps_settings.php', 'wordpress-core-plugin/sidebar-ps.php', 'wordpress-core-plugin/functions.php', 'padsquad.php', 'ps_extras.php', 'plugin-updates/**', 'header_info.php'],
                    dest: 'bld_stable/'
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
                    dest: 'wpplugin/beta/padsquad.zip',
                    params: {
                        ContentType: 'application/zip',
                        CacheControl: 'no-cache'
                    }
                },
                {
                    expand: false,
                    src: ['update_beta.json'],
                    dest: 'wpplugin/update_beta.json',
                    params: {
                        ContentType: 'application/json',
                        CacheControl: 'no-cache'
                    }
                }]
            },
            stable: {
                files: [{
                    expand: false,
                    src: ['padsquad.zip'],
                    dest: 'wpplugin/stable/padsquad.zip',
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
            },
            stable: {
                expand: true,
                cwd: 'bld_stable',
                src: ['./**'],
                dest: './'
            }
        },
        replace: {
            comments: {
                src: ['bld/wordpress-core-plugin/padsquad.php'],
                dest: 'bld/wordpress-core-plugin/padsquad.php',
                replacements: [{
                    from: /\/\*([\s\S]*?)\*\//gm,
                    to: ''
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-aws-s3-gzip');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('build', ['Building wordpress'], function() {
        grunt.file.delete("./bld", [{
            force: true
        }]);

        grunt.task.run('copy:main');
        grunt.task.run('replace:comments');
        grunt.task.run('compress:main');
        grunt.task.run('aws_s3:production');
    });

    grunt.registerTask('stable', ['Creating stable'], function() {
        grunt.file.delete("./bld_stable", [{
            force: true
        }]);

        grunt.task.run('copy:stable');
        grunt.task.run('replace:comments');
        grunt.task.run('compress:stable');
        grunt.task.run('aws_s3:stable');
    });

    grunt.registerTask('remove', ['Removing header'], function () {
        grunt.task.run('replace:comments');
    })
};
