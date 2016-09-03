var gulp = require('gulp');
var inject = require('gulp-inject');
var gutil = require('gulp-util'); 
var replace = require('gulp-replace');
var fs = require('fs');
var beautify = require('gulp-beautify');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');  
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var spriteImage = require('gulp.spritesmith');
var merge = require('merge-stream');
var zip = require('gulp-zip');
var webserver = require('gulp-webserver');
var connect = require('gulp-connect');
var open = require('opn');
var watch = require('gulp-watch');

var appConfig = {
  appName: 'Columbus Global',
  destination: 'dist/',
  cssPath : 'dist/css',
  jsPath: 'dist/js',
  assets : 'dist/',
  components : 'dist/components/',
  templates : 'dist/templates',
  spritePath : 'dist/css/',
  globalCSS : 'dist/css/*.css'
};

var paths = {
  scripts: ['src/js/*.js'],
  component_sass : ['src/components/**/*.scss'],
  global_sass : ['src/scss/*.scss'],
  spriteImages : ['src/assets/images/icons/*.png'],
  componentHTML : ['src/components/**/*.html'],
  assets : ['src/assets/**/**/**/**'],
  jsFileName : ['global.js'],
  spriteDest : ['../assets/images/icons/icon-sprite.png']
};

gulp.task('watch', function(){
  gulp.watch('src/components/**/*.scss', ['sass']);
  gulp.watch('src/scss/**/*.scss', ['global-sass']); 
  gulp.watch('src/components/**/*.html', ['components']); 
  gulp.watch('templates/*.html', ['buildHTML']);
  gulp.watch('src/components/**/*.html', ['buildHTML']);  
  gulp.watch('src/js/*.js', ['scripts']);   
  gulp.watch('src/scss/common/*.scss', ['global-sass']);
  gulp.watch('src/assets/**/**/**/*', ['assets']);
  gulp.watch(paths.spriteImages, ['global-sass']);
  watch('dist/components/**/*').pipe(connect.reload());
  watch('dist/css/*.css').pipe(connect.reload());
  watch('dist/assets/**/**/**/**').pipe(connect.reload());
}); 

var server = {
  host: 'localhost',
  port: '8080'
}

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
  .pipe(uglify())
  .pipe(concat('global.js'))
  .pipe(gulp.dest(appConfig.destination + 'scripts/'));
});


gulp.task('sass', function(){
  return gulp.src(paths.component_sass)
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest(appConfig.components));
  });

gulp.task('global-sass', function(){
  var sassStream;

  sassStream = gulp.src(paths.global_sass)
    .pipe(sass({errLogToConsole: true})); // Using gulp-sass

    var spriteData = gulp.src(paths.spriteImages)
    .pipe(spriteImage({
      imgName: '../images/icons/icon-sprite.png',
      cssName: 'sprite.css'
    }));
    spriteData.img.pipe(gulp.dest(appConfig.spritePath));

    var data =  merge(sassStream, spriteData.css)
    .pipe(concat('global.css'))
    .pipe(gulp.dest(appConfig.cssPath));    

    return data;
  });

gulp.task('buildHTML', function () {
  var file;
  var file1;
  var link = '<link href="../components/';
  var rel = 'rel=\"stylesheet\" />';

  return gulp.src('templates/*.html')
  .pipe(replace(/{{ ([^\.]+\.html) }}/g, function(s, filename) {
    file = filename.substr(0, filename.lastIndexOf('.'));      
    var style = fs.readFileSync('src/components/'+file+'/'+filename, 'utf8');
    return style;
  }))
  .pipe(replace(/{{ ([^\.]+\.css) }}/g, function(s, filename) {
    file1 = filename.substr(0, filename.lastIndexOf('.'));        
    return link+file1+'/'+filename+ "\""+ "  " +rel;
  }))
  .pipe(gulp.dest(appConfig.templates));
});

gulp.task('components', function() {  
  gulp.src(paths.componentHTML)
  .pipe(gulp.dest(appConfig.components))  
});

gulp.task('assets', function() {  
  gulp.src(paths.assets)
  .pipe(gulp.dest(appConfig.assets));
});

gulp.task('clean', function() {
 return gulp.src(appConfig.destination)
 .pipe(clean())
 pipe(connect.reload());

});

gulp.task('server', function() {
  connect.server({
    name : appConfig.appName,
    root : 'dist',
    host : server.host,
    port : server.port,
    livereload: true 
  });
});

gulp.task('openbrowser', function() {
  open ('http://' + server.host + ':' + server.port );
});

gulp.task('zip', function(){
  var zipName = getDateTime() + ".zip";
  return gulp.src('dist/**/**/*')
  .pipe(zip(zipName))
  .pipe(gulp.dest('build/'));
});

gulp.task('build', [ 'sass', 'global-sass', 'buildHTML', 'components', 'assets', 'scripts', 'watch'] );
gulp.task('serve', [ 'build', 'server', 'openbrowser']);
gulp.task('prod', ['zip']);


function getDateTime() {
  var now     = new Date(); 
  var year    = now.getFullYear();
  var month   = now.getMonth()+1; 
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds(); 
  if(month.toString().length == 1) {
    var month = '0'+month;
  }
  if(day.toString().length == 1) {
    var day = '0'+day;
  }   
  if(hour.toString().length == 1) {
    var hour = '0'+hour;
  }
  if(minute.toString().length == 1) {
    var minute = '0'+minute;
  }
  if(second.toString().length == 1) {
    var second = '0'+second;
  }   
  var dateTime = year+'-'+month+'-'+day+' '+hour+'.'+minute+'.'+second;   
  return dateTime;
}