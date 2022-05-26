import type { Component, ComponentType } from 'preact'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { History } from 'history'

export type AppResponse = {
  success: boolean,
  message: string,
  data?: { [string]: any },
  errors?: { [string]: any },
  response?: AxiosResponse,
  error?: any,
}
export type AppContext = {
  app: { [string]: any },
  user: {
    user: string,
    email: string,
  } | null | undefined,
  authorized: boolean,
  request: AxiosInstance,
  requestController: AbortController,
  login: (payload: { username: string, password: string, remember?: string|bool }) => Promise<AppResponse>,
  logout: () => Promise<void>,
  loadMenu: () => Promise<void>,
  activePath: string,
  setActivePath: (path: string) => void,
  history: History,
  requestC: CancelableRequestFn
}
export type useContext = () => AppContext
export type CancelableRequestFn = (config: AxiosRequestConfig, controlGroup?: AbortController) => ({
  result: Promise<AppResponse>,
  control: AbortController,
  abort: (reason?: string) => void,
})
