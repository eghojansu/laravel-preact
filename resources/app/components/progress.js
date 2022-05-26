export const ProgressAlert = ({ text = 'Please wait...' }) => (
  <div class="alert alert-info" role="alert">
    <div class="d-flex justify-content-center align-items-center">
      <span class="spinner-grow spinner-grow-sm me-3" role="status" aria-hidden="true"></span>
      {text}
    </div>
  </div>
)
