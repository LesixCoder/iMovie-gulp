import * as gulp from "gulp";
import * as htmlImport from "gulp-html-import";
import * as del from "del";
import * as stylus from "gulp-stylus";
import * as browser from "browser-sync";
import * as sourcemaps from "gulp-sourcemaps";
import * as ts from "gulp-typescript";
import * as run from "run-sequence";
import * as combiner from "stream-combiner2";
// import * as gulpIgnore from "gulp-ignore";

const browserSync = browser.create();

gulp.task("log", () => {
  console.log("===== log =====");
});

gulp.task("template", () => {
  const combined = combiner.obj([
    gulp.src(["src/**/*.html", "!src/**/_*.html"]),
    htmlImport("src/"),
    browserSync.stream(),
    gulp.dest("build")
  ]);
  combined.on("error", console.error.bind(console));
  return combined;
});

gulp.task("clean", () => {
  del.sync("build");
});

gulp.task("ts", () => {
  const tsProject = ts.createProject("tsconfig.json");
  gulp
    .src("src/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build"));
});

gulp.task("styl", () => {
  const combined = combiner.obj([
    gulp.src(["src/**/*.styl", "!src/**/_*.styl"]),
    sourcemaps.init(),
    stylus(),
    sourcemaps.write("."),
    browserSync.stream(),
    gulp.dest("build")
  ]);
  combined.on("error", console.error.bind(console));
  return combined;
});

gulp.task("static", () => {
  gulp.src("src/assets/**").pipe(gulp.dest("build/assets/"));
});

gulp.task("reload", browserSync.reload);

gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });

  gulp.watch("src/**", (...args) => {
    console.log("========== args ");
    console.log(args);
    console.log("========== args ");
    run(["styl", "template"], "ts", "static", "reload");
  });
});
