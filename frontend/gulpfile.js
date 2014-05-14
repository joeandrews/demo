var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({
    lazy: false
});

gulp.task('scripts', function() {
    //combine all js files of the app
    gulp.src(['!./app/**/*_test.js', '!./app/lib/**/*.js', './app/lib/js/backstretch.js', './app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('./../backend/assets/js'));
});

gulp.task('templates', function() {
    //combine all template files of the app into a js file
    gulp.src(['!./app/index.html',
        './app/**/*.html'
    ])
        .pipe(plugins.angularTemplatecache('templates.js', {
            standalone: true
        }))
        .pipe(gulp.dest('./../backend/assets/js'));
});

gulp.task('css', function() {
    gulp.src('./app/**/*.css')
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest('./../backend/assets/css'));
});

gulp.task('vendorJS', function() {
    //concatenate vendor JS files
    // bring in bower componetns and any custom lib files
    var files = [
        '!./bower_components/**/*.min.js',
        './app/lib/js/jquery.min.js',
        './bower_components/angular/angular.js',
        './bower_components/angular-route/angular-route.js',
        './bower_components/angular-ui-router/release/angular-ui-router.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        './bower_components/lodash/dist/lodash.js',
        './bower_components/restangular/dist/restangular.js',
        './app/lib/js/chart.js',
        './app/lib/js/angles.js',
        './app/lib/js/socket.io.js',
        './app/lib/js/sail.socket.io.js',
        './bower_components/angular-sails/dist/angular-sails.js'
    ];
    gulp.src(files)
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest('./../backend/assets/js'));
});

gulp.task('vendorCSS', function() {
    //concatenate vendor CSS files
    var files = ['!./bower_components/**/*.min.css',
        './bower_components/font-awesome/css/font-awesome.css',
        './lib/css/bootstrap.css'
    ];
    gulp.src(files)
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest('./../backend/assets/css/'));
});

gulp.task('copy-index', function() {
    gulp.src('./app/index.html')
        .pipe(gulp.dest('./../backend/assets'));
});
gulp.task('copy-images', function() {
    gulp.src('./app/img/*')
        .pipe(gulp.dest('./../backend/assets/img'));
});

gulp.task('watch', function() {
    gulp.watch([
        'build/**/*.html',
        'build/**/*.js',
        'build/**/*.css'
    ], function(event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });
    gulp.watch(['./app/**/*.js', '!./app/**/*test.js'], ['scripts']);
    gulp.watch(['!./app/index.html', './app/**/*.html'], ['templates']);
    gulp.watch('./app/**/*.css', ['css']);
    gulp.watch('./app/index.html', ['copy-index']);

});

gulp.task('connect', plugins.connect.server({
    root: ['./../backend/assets'],
    port: 9000,
    livereload: true
}));



gulp.task('default', ['connect', 'scripts', 'templates', 'css', 'copy-index', 'copy-images', 'vendorJS', 'vendorCSS', 'watch']);