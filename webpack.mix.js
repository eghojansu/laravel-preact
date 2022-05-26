require('dotenv').config()

const mix = require('laravel-mix')
const url = process.env.APP_URL
  .replace('${SERVER_HOST}', process.env.SERVER_HOST)
  .replace('${SERVER_PORT}', process.env.SERVER_PORT)

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .webpackConfig({
    resolve: {
      alias: {
        "react": "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",     // Must be below test-utils
        "react/jsx-runtime": "preact/jsx-runtime",
      },
    },
  })
  .js('resources/js/shared.js', 'public/assets')
  .sass('resources/css/shared.sass', 'public/assets')
  .js('resources/app/index.js', 'public/assets/app.js')
  .sass('resources/app/styles.sass', 'public/assets/app.css')
  .sourceMaps(['local', 'dev', 'development'].includes(process.env.APP_ENV))
  .browserSync({
    proxy: url,
    open: false,
  })
