<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="headline primary white--text">
            <router-link v-if="!standAlone" to="/">
              <font-awesome-icon
                size="sm"
                class="sm-1"
                color="white"
                :icon="['fa', 'home']"
              />
            </router-link>
            <div
              class="breadcrumbs"
              v-for="crumb of breadcrumbs"
              :key="crumb.name"
            >
              /
              <a
                class="breadcrumb-link"
                @click="explore(crumb.href)"
              >
                {{ crumb.name }}
              </a>
            </div>
            <v-spacer />
            <span>
              <input
                id="fileUpload"
                type="file"
                multiple
                hidden
                :disabled="!shareWritePermission"
                @change="upload"
              >
              <v-btn
                class="white bar-btn"
                v-if="shareWritePermission"
                @click="chooseFiles"
              >
                <font-awesome-icon
                  size="lg"
                  class="sm-1 btn-icon"
                  :icon="['fa', 'upload']"
                />
                Upload
              </v-btn>
              <!-- <v-btn
                class="white bar-btn"
                @click="downloadDirectory()"
              >
                <font-awesome-icon
                  size="lg"
                  class="sm-1 btn-icon"
                  :icon="['fa', 'file-archive']"
                />
                Download Directory
              </v-btn> -->
            </span>
          </v-card-title>
          <v-card-text class="text-left">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <font-awesome-icon
                    size="lg"
                    class="mx-1"
                    :icon="['fa', 'search']"
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-text-field
                    id="searchField"
                    class="searchField"
                    label="Search:"
                    v-model="searchText"
                    :error="filteredFolders.length === 0 && filteredFiles.length === 0 && searchText.length > 0"
                  />
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-if="filteredFolders.length === 0 && filteredFiles.length === 0">
                <v-list-item-content>
                  <v-alert
                    type="info"
                    v-if="!loading"
                  >
                    {{ searchText.length > 0 ? "No results for the current search" : "Current directory is empty" }}
                  </v-alert>
                  <v-progress-linear
                    indeterminate
                    v-if="loading"
                  />
                </v-list-item-content>
              </v-list-item>

              <v-divider />
              <v-subheader inset>
                Folders
              </v-subheader>
              <div v-if="isMobile">
                <v-list-item
                  v-for="item in filteredFolders"
                  :key="item.name"
                  class="hover-highlight"
                  @click="explore(item.name)"
                >
                  <v-list-item-avatar>
                    <font-awesome-icon
                      size="lg"
                      class="mx-1"
                      :icon="['fa', 'folder']"
                    />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
              <v-data-table
                v-if="!isMobile"
                :loading="loading"
                :headers="headers"
                :items="filteredFolders"
                single-select
                item-key="name"
                hide-default-footer
                :items-per-page="Number.MAX_SAFE_INTEGER"
                no-data-text="--"
                @click:row="explore"
              >
                <template v-slot:item.icon>
                  <v-list-item-avatar>
                    <font-awesome-icon
                      size="lg"
                      class="mx-1"
                      :icon="['fa', 'folder']"
                    />
                  </v-list-item-avatar>
                </template>
              </v-data-table>
              <v-subheader
                inset
                v-if="files.length > 0"
              >
                Files (click to download)
              </v-subheader>
              <div v-if="files.length > 0 && isMobile">
                <v-list-item
                  v-for="item in filteredFiles"
                  :key="item.name"
                  class="hover-highlight"
                  @click="download(item.name)"
                >
                  <v-list-item-avatar>
                    <font-awesome-icon
                      size="lg"
                      class="mx-1"
                      :icon="getIcon(item.name.split('.').pop())"
                    />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
              <v-data-table
                v-if="files.length > 0 && !isMobile"
                :loading="loading"
                :headers="headers"
                :items="filteredFiles"
                single-select
                item-key="name"
                hide-default-footer
                :items-per-page="Number.MAX_SAFE_INTEGER"
                no-data-text="--"
                @click:row="download"
              >
                <template v-slot:item.icon="{ item }">
                  <v-list-item-avatar>
                    <font-awesome-icon
                      size="lg"
                      class="mx-1"
                      :icon="getIcon(item.name.split('.').pop())"
                    />
                  </v-list-item-avatar>
                </template>
                <template
                  v-slot:item.size="{ item }" >
                  {{ formatBytes(item.size) }}
                </template>
              </v-data-table>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from './api'
import { mapActions } from 'vuex'
export default {
  name: 'TxBrowser',
  props: {
    setShare: {
      default: '',
      type: String
    },
    standAlone: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      shareWritePermission: false,
      loading: true,
      share: '',
      path: '',
      searchText: '',
      files: [],
      folders: [],
      headers: [
        { text: '', value: 'icon', align: 'middle', width: '60px', sortable: false },
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        { text: 'Modified', value: 'dates.modified' },
        { text: 'Created', value: 'dates.created' },
        { text: 'Size', value: 'size' }
      ],
      breadcrumbs: [],
      selected: null,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    }
  },
  mounted () {
    if (!this.standAlone) {
      this.share = this.$route.params.share
      this.path = typeof this.$route.params.path === 'undefined' ? '' : this.$route.params.path + '/'
    } else {
      this.share = this.setShare
      this.path = ''
      this.getSharesAction()
    }
    if (this.sharesLoaded) {
      this.setWritePermission()
    }
    this.getFileList(this.share, this.path)
  },
  methods: {
    ...mapActions([
      'getSharesAction'
    ]),
    updateBreadcrumbs () {
      const folderList = this.path.split('/')
      if (folderList.slice(-1)[0] === '') {
        folderList.pop()
      }
      this.breadcrumbs = [{
        name: this.share,
        disabled: folderList.length === 0,
        href: '../'.repeat(folderList.length)
      }]
      for (let i = 0; i < folderList.length; i++) {
        this.breadcrumbs.push({
          name: folderList[i],
          disabled: i === folderList.length - 1,
          href: '../'.repeat(folderList.length - i - 1)
        })
      }
    },
    chooseFiles () {
      document.getElementById('fileUpload').click()
    },
    getFileList (share, path) {
      this.loading = true
      api.getFileList(this.share, this.path)
        .then(response => {
          this.files = response.data.files.filter(f => f.type === 'FILE').map(elt => this.stripName(elt))
          this.folders = this.prependDotDot(response.data.files.filter(f => f.type === 'FOLDER').map(elt => this.stripName(elt)))
          this.updateBreadcrumbs()
          this.loading = false
          this.searchText = ''
          if (!this.isMobile && !this.standAlone) {
            document.getElementById('searchField').focus()
          }
        })
        .catch(e => {
          console.log('Shares error', e)
        })
    },
    upload (blob) {
      // handle file here. File will be an object.
      for (const file of blob.srcElement.files) {
        console.log(this.path, file)
        api.postFile(this.share, this.path + file.name)
          .then(response => {
            const fields = response.data.FileUpload.fields
            const url = response.data.FileUpload.url
            const formData = new FormData()
            Object.keys(fields).forEach(key => {
              formData.append(key, fields[key])
            })
            formData.append('file', file)
            // Don't use axios here or will leak your bearer token because of the hook to add it to all requests.
            const xhr = new XMLHttpRequest()
            xhr.open('POST', url, true)
            xhr.send(formData)
            xhr.onload = function () {
              if (this.status === 204) {
                console.log('success')
                this.getFileList(this.share, this.path)
              } else {
                console.log(this.responseText)
              }
            }
          })
          .catch(e => {
            console.log('Shares error', e)
          })
      }
    },
    prependDotDot (folders) {
      if (this.path.split('/').slice(0, -1).length > 0) {
        folders.unshift({
          dates: {
            created: null,
            modified: null
          },
          name: '../',
          size: null,
          tags: [],
          type: 'FOLDER',
          uri: '../'
        })
      }
      return folders
    },
    explore (cd) {
      if (this.loading) { return }
      const folderName = typeof cd === 'object' ? cd.name : cd
      this.loading = true
      if (folderName.slice(0, 3) === '../') {
        const upDirCount = folderName.split('/').length
        const pathDepth = this.path.split('/').length
        this.path = this.path.split('/').slice(0, pathDepth - upDirCount).join('/') + '/'
        if (this.path === '/') {
          this.path = ''
        }
      } else if (folderName !== '') {
        this.path += folderName + '/'
      }
      const url = `/l/${this.share}/${this.path}`
      this.getFileList(this.share, this.path)
      if (!this.standAlone) {
        this.$router.push(url) // This updates the URL but doesn't nav away since it's the same component
      }
    },
    stripName (elt) {
      elt.name = elt.name.slice(-1) === '/' ? elt.name.split('/').slice(-2)[0] : elt.name.split('/').slice(-1)[0]
      return elt
    },
    setWritePermission () {
      if (this.standAlone) {
        api.getShares()
          .then(response => {
            this.setWritePermissionHelper(response.data.shares)
          })
          .catch(e => {
            console.log('Shares error', e)
          })
      } else {
        this.setWritePermissionHelper(this.$store.state.shares)
      }
    },
    setWritePermissionHelper (shares) {
      const shareIdx = shares.findIndex((share) => share.cd === this.share)
      this.shareWritePermission = this.$store.state.session.userRoles.filter(role => shares[shareIdx].roles.write.includes(role)).length > 0
    },
    download (file) {
      console.log(file.name)
      api.getFile(`${this.share}/file/${this.path}${file.name}`)
        .then(response => {
          const link = document.createElement('a')
          link.href = response.data.file
          // Get the file name
          const parts = file.name.split('/')
          const lastSegment = parts.pop() || parts.pop() // handle potential trailing slash
          link.setAttribute('download', lastSegment) // or any other extension
          document.body.appendChild(link)
          link.click()
        })
        .catch(e => {
          console.log('Shares error', e)
        })
    },
    downloadDirectory () {
      for (const file of this.files) {
        this.download(file)
      }
    },
    formatBytes (bytes, decimals = 1) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    getIcon (extension) {
      const icons = {
        image: ['fa', 'file-image'],
        pdf: ['fa', 'file-pdf'],
        word: ['fa', 'file-word'],
        powerpoint: ['fa', 'file-powerpoint'],
        excel: ['fa', 'file-excel'],
        csv: ['fa', 'file-csv'],
        audio: ['fa', 'file-audio'],
        video: ['fa', 'file-video'],
        archive: ['fa', 'file-archive'],
        code: ['fa', 'file-code'],
        text: ['fa', 'file-alt'],
        file: ['fa', 'file']
      }
      const extensions = {
        gif: icons.image,
        jpeg: icons.image,
        jpg: icons.image,
        png: icons.image,

        pdf: icons.pdf,

        doc: icons.word,
        docx: icons.word,

        ppt: icons.powerpoint,
        pptx: icons.powerpoint,

        xls: icons.excel,
        xlsx: icons.excel,

        csv: icons.csv,

        aac: icons.audio,
        mp3: icons.audio,
        ogg: icons.audio,

        avi: icons.video,
        flv: icons.video,
        mkv: icons.video,
        mp4: icons.video,

        gz: icons.archive,
        zip: icons.archive,

        css: icons.code,
        html: icons.code,
        js: icons.code,
        py: icons.code,
        sh: icons.code,

        txt: icons.text,
        md: icons.text
      }
      return extensions[extension.toLowerCase()] || icons.file
    }
  },
  computed: {
    filteredFolders () {
      return this.folders.filter(t => t.name.toLowerCase().includes(this.searchText.toLowerCase()))
    },
    filteredFiles () {
      return this.files.filter(t => t.name.toLowerCase().includes(this.searchText.toLowerCase()))
    },
    sharesLoaded () {
      return this.standAlone || this.$store.state.shares.length > 0
    }
  },
  watch: {
    '$route.path': function (path) {
      if (this.standAlone || this.$route.path.substr(0, 3) === '/d/') return false
      const newPath = this.$route.path.split('/').slice(3, -1).join('/')
      if ((newPath.concat('/') !== this.path && newPath.length !== 0) || (newPath !== this.path && newPath.length === 0)) {
        if (this.path.length > newPath.length) {
          const offset = newPath.length === 0 ? 0 : 1
          this.explore('../'.repeat(this.path.substr(newPath.length + offset).split('/').length - 1))
        } else {
          this.explore(newPath.substr(this.path.length))
        }
        return true
      }
      return false
    },
    sharesLoaded: function (loaded) {
      if (loaded) {
        this.setWritePermission()
      }
    }
  }
}
</script>
<style lang="scss">
.searchField {
  padding-right: 56px;
}
.btn-icon {
  margin-right: 12px;
}
.bar-btn {
  margin-left: 16px;
}
button.v-btn {
  padding-left: 10px;
}
div.breadcrumbs {
  padding-left: 8px;
  text-align: left;
}
a.breadcrumb-link {
  color: white !important;
}
a.breadcrumb-link:hover {
  background-color: rgb(30, 59, 94);
}
a.v-breadcrumbs__item {
  color: white !important;
  font-size: 20px;
}
div.v-data-table {
  margin-right: 56px;
  margin-left: 56px;
  border-bottom: none;
}
.v-data-table tbody tr {
  border-bottom: none;
}
tbody {
  cursor: pointer;
}
td.text-start {
  font-size: 16px;
}
</style>