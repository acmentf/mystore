var gulp = require("gulp"),
hash_src = require("gulp-hash-src");

gulp.task("hash", function() {
return gulp.src(["./dist/**/*.html"])
    .pipe(hash_src({build_dir: "./dist", src_path: "./dist"}))
    .pipe(gulp.dest("./dist"))
});