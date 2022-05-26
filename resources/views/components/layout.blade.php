<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ $_pageTitle }}</title>
  <link rel="stylesheet" href="{{ mix('assets/shared.css') }}">
  {{ $styles ?? null }}
</head>
<body>
  <noscript>Please enable Javascript in your browser</noscript>

  {{ $slot }}
  <script src="{{ mix('assets/shared.js') }}"></script>
  {{ $scripts ?? null }}
</body>
</html>
