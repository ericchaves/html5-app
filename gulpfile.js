/* global process */ 
'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var log = util.log;
var mocha = require('gulp-mocha');

gulp.task('dot', function() {
  var dotPacker = require("gulp-dotjs-packer");
  gulp.src('app/scripts/templates/*.jst')
    .pipe(dotPacker({
      fileName: "templates.js"
    }))
    .pipe(gulp.dest('app/scripts/templates/'));
});

gulp.task('clean', function (cb) {
    require('rimraf')('dist', cb);
});

gulp.task('lint', function () {
    var jshint = require('gulp-jshint');

    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('styles', function () {
    var sass = require('gulp-sass');

    return gulp.src('app/styles/*.scss')
        .pipe(sass({
            precision: 10
        }))
        .pipe(gulp.dest('app/styles'));
});

gulp.task('images', function () {
    var cache = require('gulp-cache'),
        imagemin = require('gulp-imagemin');

    return gulp.src('app/images/**/*')
        .pipe(cache(imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src('app/styles/fonts/*')
        .pipe(gulp.dest('dist/styles/fonts'));
});

gulp.task('misc', function () {
    return gulp.src([
            'app/*.{ico,png,txt}',
            'app/.htaccess'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('html', ['styles'], function () {
    var uglify = require('gulp-uglify'),
        minifyCss = require('gulp-minify-css'),
        useref = require('gulp-useref'),
        gulpif = require('gulp-if'),
        assets = useref.assets();

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/index.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
        
    gulp.src('app/specs.html')
        .pipe(wiredep({
            directory: 'app/bower_components',
            devDependencies: true
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('connect', function () {
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(serveStatic('app'))
        .use(serveStatic('test'))
        .use(serveIndex('app'));

    require('http').createServer(app)
        .listen(3000)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:9000.');
        });
});

gulp.task('serve', ['dot','styles', 'connect'], function () {
    var livereload = require('gulp-livereload');

    livereload.listen();

    require('opn')('http://localhost:3000');

    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*',
        'app/templates/**/*.jst'
    ]).on('change', livereload.changed);
    
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('bower.json', ['wiredep']);
});


gulp.task('test:sauce', function (done) {    
    var launcher = require('sauce-connect-launcher');

    // checking sauce credential
    if(!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY){
        log(util.colors.red(
            ['Missing sauce credentials\n',
            '\tPlease configure your sauce credential:\n',
            '\texport SAUCE_USERNAME=<SAUCE_USERNAME>\n',
            '\texport SAUCE_ACCESS_KEY=<SAUCE_ACCESS_KEY>'].join('')
         ));
        return done();
    }

    var options = {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        verbose: true,
        logfile: './sauce_connect.log'  
    };
        
    launcher(options, function(err, tunnel){
        if (err) { 
            log('error detected.');
            return done(err); 
        }
        log('Sauce Connect connected.');
        
        var mocha = require('gulp-mocha');

        // gulp-mocha needs filepaths so you can't have any plugins before it
        return gulp.src('test/sauce/**/*.js', {read: false})
        .pipe(mocha({reporter: 'spec', ui: 'bdd'}))
        .on('end', function() {
            tunnel.close(function(){
                log('Sauce Connect disconnected.');
                done();
            });
        });        
    });

});


gulp.task('build', ['lint', 'html', 'images', 'fonts', 'misc','dot']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
