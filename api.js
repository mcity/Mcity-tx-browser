import axios from 'axios'

const devEnv = false
const domain = devEnv ? 'http://127.0.0.1:5000' : ''

export default {
  getShares: () => {
    return axios.get(`${domain}/api/shares`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  getFileList: (cd, path) => {
    if (typeof path === 'undefined') {
      path = ''
    }
    return axios.get(`${domain}/api/share/${cd}/files/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  getFile: (url) => {
    return axios.get(`${domain}/api/share/${url}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  postFile: (cd, path) => {
    return axios.post(`${domain}/api/share/${cd}/file/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  }
}
