const mix = require('laravel-mix')

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
  .js('resources/app/frontend/index.js', 'public/js/app.js')
  .js('resources/app/backend/index.js', 'public/js/adm.js')
  .sass('resources/css/main.sass', 'public/css/main.css')
  .webpackConfig({
    resolve: {
      'alias': {
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  })
  .sourceMaps()
  .browserSync(process.env.APP_URL)
