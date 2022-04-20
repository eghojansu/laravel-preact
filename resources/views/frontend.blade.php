<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ $env['name'] }}</title>
  <link rel="stylesheet" href="{{ mix('css/main.css') }}" />
</head>
<body class="min-vh-100">
  <noscript>Your browser does not support Javascript. Please consider to upgrade.</noscript>
  <div class="loading-awesome min-vh-100 d-flex justify-content-center align-items-center">
    <div class="spinner-border text-success" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <script>const _env = {{ Js::from($env) }}</script>
  <script src="{{ mix('js/app.js') }}" type="text/javascript"></script>
</body>
</html>
