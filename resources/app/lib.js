import axios from 'axios'

export const caseSnake = camel => `${camel.charAt(0).toLowerCase()}${camel.slice(1).replace(/[A-Z]/, (...m) => `_${m[1].toLowerCase()}`)}`
export const caseCamel = snake => `${snake.charAt(0).toLowerCase()}${snake.slice(1).replace(/_(\w)/, (...m) => m[1].toUpperCase())}`
export const casePascal = snake => `${snake.charAt(0).toUpperCase()}${snake.slice(1).replace(/_(\w)/, (...m) => m[1].toUpperCase())}`
export const caseTitle = text => `${text.charAt(0).toUpperCase()}${text.slice(1).replace(/[A-Z]/, ' $1').replace(/_(\w)/, (...m) => ` ${m[1].toUpperCase()}`)}`
export const createRequester = ({
  onRequest,
  onRequestError,
  onResponse,
  onResponseError,
} = {}) => {
  const request = axios.create({
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  request.interceptors.request.use(
    config => (onRequest && onRequest(config)) || config,
    error => {
      const norm = { success: false, message: 'Request error', error }

      return Promise.reject((onRequestError && onRequestError(norm)) || norm)
    },
  )
  request.interceptors.response.use(
    response => {
      const { data, statusText } = response
      const norm = { ...data, message: data.message || statusText, success: data.ok || false, response }

      return (onResponse && onResponse(norm)) || norm
    },
    error => {
      const { response: { data, statusText }} = error
      const norm = { ...data, message: data.message || statusText, success: false, error }

      return Promise.reject((onResponseError && onResponseError(norm)) || norm)
    },
  )

  return request
}
