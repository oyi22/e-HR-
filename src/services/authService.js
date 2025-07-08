import api from './api'

export const login = async (email, password) => {
  return api.post('/auth/login', { email, password });
}

export const register = async (data) => {
  return api.post('/auth/register', data)
}
