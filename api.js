import axios from 'axios'

export default {
  getShares: () => {
    return axios.get('/api/shares')
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  getFileList: (cd, path) => {
    if (typeof path === 'undefined') {
      path = ''
    }
    return axios.get(`/api/share/${cd}/files/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  getFile: (url) => {
    return axios.get(`/api/share/${url}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  postFile: (cd, path) => {
    return axios.post(`/api/share/${cd}/file/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  }
}
