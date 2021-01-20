import axios from 'axios'

export default {
  getShares: () => {
    return axios.get(`${process.env.VUE_APP_TX_SERVER || ''}/api/shares`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
    },
  getFileList: (cd, path) => {
    if (typeof path === 'undefined') {
      path = ''
    }
    return axios.get(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/files/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  getFile: (url) => {
    return axios.get(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${url}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  postFile: (cd, path) => {
    return axios.post(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/file/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  postFolder: (cd, path) => {
    return axios.post(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/folder/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  }
}
