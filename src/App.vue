<template>
  <div id="app">
    <div class="img-to-canvas">
      <div class="v-box v-img">
        <img :src="img" ref="reqImage">
      </div>
      <div class="v-box v-canvas" ref="pullSource"></div>
    </div>

    <div class="btn-group">
      <label class="upload">
        <input type="file" title="Try" ref="tryUpload">
        <div class="fileBox">Upload Try</div>
      </label>
      <input type="button" @click="onFilters(filter)" :value="filter" v-for="(filter, index) in filterList" :key="index" />
      <input type="button" @click="onReset" value="Reset">
    </div>
    <div class="msg">{{ msg }}</div>
    <div class="mask" v-show="loading">
      <div class="spinner">
        <div class="cube1">Image</div>
        <div class="cube2">Canvas</div>
      </div>
    </div>
  </div>
</template>

<script>
import filterImages from 'filter-images'
export default {
  name: 'app',
  data () {
    return {
      loading: false,
      img: require('./assets/img/1.jpg'),
      msg: '',
      filterList: [
        'invert',
        'gray',
        'blur',
        'relief',
        'sculpture',
        'mirror',
        'baw'
      ]
    }
  },
  mounted () {
    // upload onchange
    this.$refs.tryUpload.onchange = this.onTry

    // Filter after the image is loaded successfully
    this.$refs.reqImage.onload = () => {
      this.onFilters()
    }
  },
  methods: {
    /**
     * loading 
     * @arg { Boolean } flag
     */
    onLoading (flag = true) {
      this.loading = flag
    },
    /**
     * Filters
     * @arg { String } type  Filter Name
     */
    onFilters (type) {
      this.onLoading()
      filterImages.filter(type, this.$refs.pullSource, this.$refs.reqImage).then(() => {
        // Successful
        // Delay is just for good looks
        setTimeout(() => {
          this.onLoading(false)
        }, 500)
      }).catch(e => {
        this.msg = e
        // Failure
        this.onLoading(false)
      })
    },
    /**
     * click Try
     * @arg { Event } ev
     */
    onTry (ev) {
      let msie = this.getMSIE()
      let img = this.$refs.reqImage
      let file = ev.target
      if (msie) { // 判断是否是IE
        // IE下，使用滤镜
        file.select()
        var imgSrc = document.selection.createRange().text
        var localImagId = document.createElement('div')
        // 必须设置初始大小
        localImagId.style.width = '1920px'
        localImagId.style.height = '592px'
        // 图片异常的捕捉，防止用户修改后缀来伪造图片
        try {
          localImagId.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)'
          localImagId.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = imgSrc
        } catch (e) {
          img.src = file.value
          return false
        }
        document.selection.empty()
      } else {
        let files = file.files[0]
        if (files.getAsDataURL) {
          img.src = files.getAsDataURL()
        } else {
          if (files.type.split('/')[0] === 'image') {
            // Firefox 7.x 
            img.src = window.URL.createObjectURL(file.files[0])
          } else {
            this.msg = 'Upload File Error'
          }
        }
      }
    },
    /**
     * Reset Canvas
     */
    onReset () {
      this.onFilters()
    },
    /**
     * Get ie version
     */
    getMSIE () {
      // IE Version
      let appName = navigator.appName
      let appVer = navigator.appVersion
      let version = appVer.split(';')
      let verTrim = version[1].replace(/[ ]/g, '')
      if (appName === 'Microsoft Internet Explorer') {
        if (verTrim === 'MSIE6.0') {
          return 6
        } else if (verTrim === 'MSIE7.0') {
          return 7
        } else if (verTrim === 'MSIE8.0') {
          return 8
        } else if (verTrim === 'MSIE9.0') {
          return 9
        } else {
          // default 10.0
          return 10
        }
      }
      return false
    }
  }
}
</script>

<style lang="less">
@import url('assets/less/reset.less');
</style>

<style lang="less" scoped>
.msg {
  color: red;
  font-size: 12px;
}
.btn-group {
  text-align: center;
  > input {
    height: 0.5rem;
    border: 1px solid;
    width: 1.5rem;
    border-radius: 0.05rem;
    margin: 0.2rem;
    cursor: pointer;
    &:hover {
      background-color: #4ac365;
    }
  }
  .upload {
    display: block;
    width: 4rem;
    margin: 0.2rem auto;
    overflow: hidden;
    height: 0.6rem;
    position: relative;
    border-radius: 0.6rem;
    border: 1px solid #ccc;
  }
  .upload:active {
    color: red;
  }
  .upload .fileBox {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    line-height: 0.6rem;
    text-align: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .upload input {
    height: 100%;
    width: 100%;
    padding-top: 1000px;
    outline: none;
  }
}

.img-to-canvas {
  text-align: center;
  margin: 0 auto;
  width: 80%;
  display: flex;
}
.img-to-canvas .v-box {
  height: 100%;
  width: 50%;
  overflow: hidden;
  border: 1px dotted red;
  padding: 5px;
  text-align: center;
  font-size: 20px;
  color: #000;
  font-weight: bold;
  position: relative;
}
.v-box img,
.v-box canvas {
  max-width: 100%;
  min-width: 100%;
}
.v-img:after {
  content: 'Before';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.1rem;
  background-color: #fb0000;
  width: 1rem;
  margin: 0 auto;
  color: #fff;
  font-size: 0.24rem;
}
.v-canvas:after {
  content: 'After';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.1rem;
  background-color: #4ac365;
  width: 1rem;
  margin: 0 auto;
  color: #000;
  font-size: 0.24rem;
}

/* css3 loading animal*/
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99999;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.mask .spinner {
  margin: 1.5rem auto;
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  top: 1.5rem;
}
.mask:after {
  content: 'Processing...';
  width: 1rem;
  margin: 0 auto;
  color: #cddc39;
  font-weight: bold;
  font-size: 16px;
  display: block;
}
.mask .cube1,
.mask .cube2 {
  font-size: 16px;
  background-color: #fb0000;
  width: 0.8rem;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  font-weight: bold;
  color: #000;
  -webkit-animation: cubemove 0.5s infinite ease-in-out;
  animation: cubemove 1.5s infinite ease-in-out;
}

.mask .cube2 {
  background-color: #67cf22;
  color: #fff;
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

@-webkit-keyframes cubemove {
  25% {
    -webkit-transform: translateX(42px) scale(1.2);
  }
  50% {
    -webkit-transform: translateX(42px) translateY(42px) scale(1.35);
  }
  100% {
    -webkit-transform: translateX(0px) translateY(42px) scale(1.5);
    z-index: 1;
  }
  100% {
  }
}

@keyframes cubemove {
  25% {
    transform: translateX(42px) scale(1.2);
    -webkit-transform: translateX(42px) scale(1.2);
  }
  50% {
    transform: translateX(42px) translateY(42px) scale(1.35);
    -webkit-transform: translateX(42px) translateY(42px) scale(1.35);
  }
  50.1% {
    transform: translateX(42px) translateY(42px) scale(1.36);
    -webkit-transform: translateX(42px) translateY(42px) scale(1.36);
  }
  75% {
    z-index: 1;
    transform: translateX(0px) translateY(42px) scale(1.5);
    -webkit-transform: translateX(0px) translateY(42px) scale(1.5);
  }
  100% {
  }
}
</style>
