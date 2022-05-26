<x-layout>
  <div id="appx">
    <div class="min-vh-100 d-flex justify-content-center align-items-center">
      <div class="spinner-border text-primary me-3" role="status" aria-hidden="true"></div>
      <p>Loading awesome, please wait...</p>
    </div>
  </div>

  <x-slot name="styles">
    <link rel="stylesheet" href="{{ mix('assets/app.css')}}">
  </x-slot>
  <x-slot name="scripts">
    <script>
      window.app = {{ Js::from($data) }}
    </script>
    <script type="module" src="{{ mix('assets/app.js') }}"></script>
  </x-slot>
</x-layout>
