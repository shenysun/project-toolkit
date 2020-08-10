const gulp = require("gulp");
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const process = require('process');

// 压缩代码插件  gulp 游戏名字
let type = process.argv[2];
let source = "";
if (type) {
    source = `./testDir/js`
}

gulp.task(type, async() => {
    del(["build/"])
    gulp.src([source + '/*.js'])
        .pipe(uglify({
            mangle: true, // 混淆变量名
            output: { ascii_only: true }
        }))
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(source))
});