import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:3000'

export function register (data) {
  return axios.post('/register', data)
}

export function login (data) {
  return axios.post('/login', data)
}

export function addUser (data) {
  return axios.post('/add_user', data)
}

export function updateUser (data) {
  return axios.put('/update_user', data)
}

export function searchUsers (data) {
  return axios.post('/search_users', data)
}

export function deleteUser (username) {
  return axios.delete(`/delete_user?username=${username}`)
}

export function addInvitation (data) {
  return axios.post('/add_invitation', data)
}

export function updateInvitation (data) {
  return axios.put('/update_invitation', data)
}

export function searchInvitations (data) {
  return axios.post('/search_invitations', data)
}

export function deleteInvitation (id) {
  return axios.delete(`/delete_invitation?id=${id}`)
}

export function toggleTop (id) {
  return axios.get(`/toggle_top?id=${id}`)
}

export function saveLike (data) {
  return axios.post('/like/save', data)
}

export function saveComment (data) {
  return axios.post('/comment/save', data)
}

export function addTab (data) {
  return axios.post('/tab/add', data)
}

export function updateTab (data) {
  return axios.put('/tab/update', data)
}

export function listTabs (data) {
  return axios.post('/tab/list', data)
}

export function deleteTab (id) {
  return axios.delete(`/tab/delete?id=${id}`)
}

export function getXxjj (id) {
  return axios.get(`/xxjj/detail?id=${id}`);
}

export function updateXxjj (data) {
  return axios.put('/xxjj/update', data);
}

export function upload (formdata) {
  return axios.post('/upload', formdata);
}
