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
  },
  deleteFile: (cd, path) => {
    return axios.delete(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/file/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  deleteFolder: (cd, path) => {
    return axios.delete(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/folder/${path}`)
      .then(function (response) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  moveFile: (cd, path, new_cd, new_path) => {
    return axios.post(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/move/file/${path}`, {new_path: new_path, new_cd: new_cd})
      .then(function (responsse) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  moveFolder: (cd, path, new_cd, new_path) => {
    return axios.post(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/move/folder/${path}`, {new_path: new_path, new_cd: new_cd})
      .then(function (responsse) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  renameFile: (cd, path, new_path) => {
    return axios.post(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/rename/file/${path}`, {new_path: new_path})
      .then(function (responsse) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  renameFolder: (cd, path, new_path) => {
    return axios.post(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/rename/folder/${path}`, {new_path: new_path})
      .then(function (responsse) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  copyFile: (cd, path, new_cd, new_path) => {
    return axios.post(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/copy/file/${path}`, {new_path: new_path, new_cd: new_cd})
      .then(function (responsse) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
  copyFolder: (cd, path, new_cd, new_path) => {
    return axios.post(`${process.env.VUE_APP_TX_SERVER || ''}/api/share/${cd}/copy/folder/${path}`, {new_path: new_path, new_cd: new_cd})
      .then(function (responsse) {
        response.currDateTime = new Date().toLocaleString()
        return response
      })
  },
}
