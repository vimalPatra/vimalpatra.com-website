(function (){

	var gulp = require('gulp');
	var uglify = require('gulp-uglify');
	var concat = require('gulp-concat');
	var rename = require('gulp-rename');
	var sass = require('gulp-sass');
	var cleanCss = require('gulp-clean-css');
	var flatten = require('gulp-flatten');
	var del = require('del');
	var sourcemaps = require('gulp-sourcemaps');
	// var ff = require('node-find-folder');

	var plumber = require('gulp-plumber');
	var eslint = require('gulp-eslint');
	var gutil = require('gulp-util');

	var browserSync = require('browser-sync');

	var postcss = require('gulp-postcss');
	var cssnext = require('postcss-cssnext');



var onError = function(err) {
  gutil.beep();
  console.log(err);
}
 
function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString())
  this.emit('end')
}



/***************************************
****************************************
****************************************
****************************************	=tasks below
****************************************
****************************************
***************************************/






// --------------------------------------------------------------------------------------------





	/**********
	********		=js 
	**********/






		/*********

			=General Task for both development and distribution builds
		
		*********/	

	// tasks for concatenating external downloaded resources if we do so 
	gulp.task('minVendorJS', function() {
		var sourceFile = gulp.src([ './source/js/vendor/**/*.js',
									'!./source/js/vendor/**/*.min.js']);

	    return sourceFile
	    	.pipe(plumber({
				errorHandler: onError
			}))
	        .pipe(uglify())
	        .pipe(rename({
				suffix: ".min"
			}))
	        .pipe(gulp.dest(function (file) {
		        return file.base;
		    }
		    ));
	});	

	// tasks for concatenating external downloaded resources if we do so 
	gulp.task('vendorJS',['minVendorJS'], function() {
		var sourceFile = gulp.src(['./source/js/vendor/**/*.min.js']);

	    return sourceFile
	    	.pipe(plumber({
				errorHandler: onError
			}))
	        //Pass desired pretend filename to vinyl-source-stream
	        .pipe(concat('vendor.js'))
	        .pipe(gulp.dest('./dist/js/'));
	});






		/*********
		
			=Dev Task for development builds
		
		*********/	

		


	// task for concatenating and linting the primary js file 
	gulp.task('js',['vendorJS'],function(){ 
		        return gulp.src(['./source/js/plugins.js',
		        				'./source/js/*.js'])
		        .pipe(plumber({
					errorHandler: onError
				}))
				.pipe(sourcemaps.init())
		        .pipe(concat('main.js'))
		        .pipe(sourcemaps.write())
		        // .pipe(eslint())
		        // .pipe(eslint.formatEach())
		        // eslint.format() outputs the lint results to the console. 
		        // Alternatively use eslint.formatEach() (see Docs). 
		        // To have the process exit with an error code (1) on 
		        // lint error, return the stream and pipe to failAfterError last. 
		        // .pipe(eslint.failAfterError())
		        .pipe(gulp.dest('./dist/js/'));
	});

	// task for concatenating and linting the primary js file, On file modification (it doesn't run any dependent tasks first)
	gulp.task('js:watch',function(){ 
		        return gulp.src(['./source/js/plugins.js',
		        				'./source/js/*.js'])
		        .pipe(plumber({
					errorHandler: onError
				}))
				.pipe(sourcemaps.init())
		        .pipe(concat('main.js'))
		        .pipe(sourcemaps.write())
		        // .pipe(eslint())
		        // .pipe(eslint.formatEach())
		        .pipe(gulp.dest('./dist/js/'))
		        .pipe( browserSync.reload({stream:true}) );
	});
	




		/*********
		
			=Dist Tasks for distribution builds
		
		*********/	


	
	// task for bundling JS files and write to single js file for distribution build  
	gulp.task('js:dist',['vendorJS'], function(){ 
		        return gulp.src(['./source/js/plugins.js',
		        				'./source/js/*.js'])
		        .pipe(plumber({
					errorHandler: onError
				}))
		        .pipe(concat('main.js'))
		        .pipe(uglify())
		        .pipe(gulp.dest('./dist/js/'));
	
		});









// --------------------------------------------------------------------------------------------




	/**********
	********		=root     html and other things in root folder
	**********/






		/*********

			=General Task for both development and distribution builds
		
		*********/	


	gulp.task('clean:root',function(cb){

		return del([
			'./dist/*'
		], cb);
	});


	gulp.task('root',['clean:root'],function(){
		var sourceFile = 
		['./source/*'];

		return gulp.src(sourceFile)
        .pipe( gulp.dest('./dist/'));
	});

	gulp.task('root:watch',function(){
		var sourceFile = 
		['./source/*'];

		return gulp.src(sourceFile)
        .pipe( gulp.dest('./dist/'))
        .pipe( browserSync.reload({stream:true}) );
	});




// --------------------------------------------------------------------------------------------



	/**********
	********		=folders that are going to move as is to the dist folder
	**********/




		/*********

			=General Task for both development and distribution builds
		
		*********/	

		/* Note: Folders need to be finished first as other files will be looking for these.
			     For e.g.; css files may need a font that is not imported
		*/

	gulp.task('folders',['root'],function(){
		var sourceFile = 
		['./source/**/*',
		'!./source/js/**/*',
		'!./source/css/**/*',
		'!./source/sass/**/*',
		'!./source/controller/**/*'];

		return gulp.src(sourceFile)
        .pipe( gulp.dest('./dist/') );
	});



	gulp.task('folders:watch',function(){
		var sourceFile = 
		['./source/**/*',
		'!./source/js/**/*',
		'!./source/css/**/*',
		'!./source/sass/**/*',
		'!./source/controller/**/*'];

		return gulp.src(sourceFile)
        .pipe( gulp.dest('./dist/') )
        .pipe( browserSync.reload({stream:true}) );
	});



// --------------------------------------------------------------------------------------------


	/**********
	********		=sass and =css
	**********/



		/*********

			=General Task for both development and distribution builds
		
		*********/	

	
	
	/* task for getting compiled css files in the css folder */

		/* NOTE: task just for getting separate compiled css files in source folder itself */
	gulp.task('sass', function(){ 
		        return gulp.src(['source/css/**/*.scss'])
		        .pipe(plumber({
					errorHandler: onError
				}))
				.pipe(sourcemaps.init())
		        .pipe(sass())
		        .on('error', swallowError)
		        .pipe(sourcemaps.write())
		        .pipe(gulp.dest('source/css/'));

	});



		/*********
		
			=Dev Task for development builds
		
		*********/	



	/* task for moving all vendor provided css files  to the dist folder*/

	gulp.task('cssVendor', function(){ 
				return gulp.src(['source/css/vendor/normalize.css',
								'source/css/vendor/**/*.css'])
				.pipe(plumber({
					errorHandler: onError
				}))
				.pipe(sourcemaps.init())
				.pipe(concat('vendor.css'))
				.pipe(sourcemaps.write())
				.pipe(gulp.dest('dist/css/'))
				.pipe(browserSync.stream());

	});



	/* task for prefixing and moving the main.css file to dist folder */

	gulp.task('css',['cssVendor','sass'], function(){ 
				var postcssPlugins = [
			        cssnext({browsers: ['last 3 version']})
			    ];				

		        return gulp.src(['source/css/main.css'])
		        .pipe(plumber({
					errorHandler: onError
				}))

				.pipe(sourcemaps.init())
		        .pipe(postcss(postcssPlugins))
		        .pipe(sourcemaps.init())
		        // .pipe(csslint())
    			// .pipe(csslint.formatter())
		        .pipe(gulp.dest('dist/css/'));	
	});

	/* task for prefixing and moving the main.css file to dist folder, On modifying the main.css file */
	gulp.task('css:watch',['sass'], function(){ 
				var postcssPlugins = [
			        cssnext({browsers: ['last 3 version']})
			    ];				

		        return gulp.src(['source/css/main.css'])
		        .pipe(plumber({
					errorHandler: onError
				}))

				.pipe(sourcemaps.init())
		        .pipe(postcss(postcssPlugins))
		        .pipe(sourcemaps.init())
		        // .pipe(csslint())
    			// .pipe(csslint.formatter())
		        .pipe(gulp.dest('dist/css/'))
		        .pipe(browserSync.stream());
	});




		/*********
		
			=Dist Tasks for distribution builds
		
		*********/	


	/* task for concatenating, minifying and moving all css files from vendors to the dist folder */

	gulp.task('cssVendor:dist', function(){ 
			return gulp.src(['source/css/vendor/normalize.css',
							'source/css/vendor/**/*.css'])
				.pipe(plumber({
					errorHandler: onError
				}))
		        .pipe(concat('vendor.css'))
		        .pipe(cleanCss())
		        .pipe(gulp.dest('dist/css/'));
		});


	
	/* task for prefixing, minifying and moving main.css file to the dist folder */

	gulp.task('css:dist',['cssVendor:dist','sass'], function(){ 
				var postcssPlugins = [
			        cssnext({browsers: ['last 3 version']})
			    ];
		        
		        return gulp.src(['source/css/main.css'])
		        .pipe(plumber({
					errorHandler: onError
				}))
		        .pipe(postcss(postcssPlugins))
		        .pipe(cleanCss())
		        .pipe(gulp.dest('dist/css/'));
		});








// --------------------------------------------------------------------------------------------








	/************
	********		=php
	************/



		/*********

			=General Task for both development and distribution builds
		
		*********/	

	gulp.task('clean:php',function(cb){

		return del([
			'./dist/controller'
		], cb);
	});



	gulp.task('php',['clean:php'],function(){
		var sourceFile = ['./source/controller/**/*.php'];

		return gulp.src(sourceFile)
  		.pipe( gulp.dest('./dist/controller/'));
	});




	gulp.task('php:watch',function(){
		var sourceFile = ['./source/controller/**/*.php'];

		return gulp.src(sourceFile)
  		.pipe( gulp.dest('./dist/controller/'))
  		.pipe( browserSync.reload({stream:true}) );
	});









// --------------------------------------------------------------------------------------------





	/***********
	********		=watch_serve task
	***********/


	gulp.task('watch_serve', function(){
		browserSync.init({
	        // server: "./"
	        proxy: "localhost:1234/vimal/dist/"
	        // proxy: "localhost:1234/stocknewsproj"
	    });

		gulp.start('watch');
	});


	/************
	*******			=watch task
	************/

	gulp.task('watch', function(){

		gulp.watch(['./source/*'],['root:watch']);
		gulp.watch(['./source/js/**/*.js'],['js:watch']);
		gulp.watch(['./source/css/*.css','./source/css/**/*.scss'],['css:watch']);
		gulp.watch(['./source/controller/**/*.php','./source/Controller/**/*.php'],['php:watch']);

		gulp.watch(['./source/**/*','!./source/js/**/*','!./source/css/**/*',
					'!./source/controller/**/*'],['folders:watch']);
		

		// gulp.watch(['./app/**/*.js','./source/js/**/*.js'],['js:watch']);
	    // gulp.watch("*.html").on('change', browserSync.reload);
	});








// --------------------------------------------------------------------------------------------







	/******
				TASK CHAINS
	******/



	
				//	DEV BUILDS
	

	/* =default task : execute for development builds*/
	gulp.task('default', ['root','js','css','php','folders'],function(cb){
		cb();
	});

	/* =run task : execute for development build and serving to the server*/
	gulp.task('run', ['default'],function(){
		gulp.start('watch_serve');
	});

	
				//	DIST BUILDS

	/* build task : execute for distribution build only*/
	gulp.task('build', ['root','js:dist','css:dist','php','folders'],function(cb){
		cb();
	});

	/* run:dist task : execute for distribution build and serving to the browser*/
	gulp.task('run:dist', ['build'],function(){
		gulp.start('watch_serve');
	});




}());