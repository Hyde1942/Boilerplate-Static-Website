var gulp = require('gulp'),
    cp   = require('child_process'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    jekyllProcess = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll',
    bundleProcess = process.platform === 'win32' ? 'bundle.bat' : 'bundle',
    browserSync = require('browser-sync').create(),
    imageMin = require('gulp-imagemin');



var paths = {

    images: {
        src: '_src/images/**/*',
        dest:'_site/images/'
    },
    styles: {
        src:'_src/scss/**/*.scss',
        dest:'_site/css/'
    },
    scripts: {
        src: '_src/js/*.js',
        dest:'_site/js/'
    }
}


function optimizeImages (){
       return gulp.src(paths.images.src)
        .pipe(imageMin())
        .pipe(gulp.dest(paths.images.dest));
}

function webServer(done) {
    browserSync.init({
        server: {
            baseDir: '_site'
        }
    });
    done();
}

function reloadWebServer(done) {
    browserSync.reload();
    done();
}

function jekyllCompiler() {
    return cp.spawn(bundleProcess, ['exec', jekyllProcess , 'build'], {stdio:'inherit'});
}

function scssCompilier (){
    return gulp.src(paths.styles.src)
    .pipe(sass({
        outputStyle: 'expanded',
        includePaths: ['scss'],
        onError: browserSync.notify
    }))
    .pipe(autoprefixer({
        browsers: 'last 2 versions'
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload({stream:true}));
}

function watch () {
    gulp.watch([
        '_includes/**/*',
        '_layouts/**/*',
        '_pages/**/*',
        '*.html'
    ],gulp.series(jekyllCompiler,reloadWebServer));

    gulp.watch(paths.styles.src, scssCompilier)
}

gulp.task('serve', gulp.series(jekyllCompiler, scssCompilier, optimizeImages , webServer, watch));
