// Filters List
const _filters = {
  // 负片-反色
  invert: function (context, data, c) {
    let dd = data.data
    let len = c.height * c.width * 4
    for (let i = 0; i < len; i += 4) {
      let r = dd[i]
      let g = dd[i + 1]
      let b = dd[i + 2]

      dd[i] = 255 - r
      dd[i + 1] = 255 - g
      dd[i + 2] = 255 - b
    }
  },
  // 灰色调
  gray: function (context, data, c) {
    let dd = data.data
    let len = c.height * c.width * 4
    for (let i = 0; i < len; i += 4) {
      let r = dd[i]
      let g = dd[i + 1]
      let b = dd[i + 2]
      // --算法一
      let cl = (0.299 * r) + (0.587 * g) + (0.114 * b)
      // --算法二(ps内置算法)
      // let cl = Math.pow((Math.pow(r,2.2) * 0.2973 + Math.pow(g,2.2) * 0.6274 + Math.pow(b,2.2) * 0.0753),(1/2.2))
      dd[i] = dd[i + 1] = dd[i + 2] = cl
    }
  },
  // 模糊
  blur: function (context, data) {
    let temp = _copyLayer(context, data)
    let red = 0.0
    let green = 0.0
    let blue = 0.0
    for (let x = 0; x < temp.width; x++) {
      for (let y = 0; y < temp.height; y++) {
        let idx = (x + y * temp.width) * 4
        for (let subCol = -2; subCol <= 2; subCol++) {
          let colOff = subCol + x
          if (colOff < 0 || colOff >= temp.width) {
            colOff = 0
          }
          for (let subRow = -2; subRow <= 2; subRow++) {
            let rowOff = subRow + y
            if (rowOff < 0 || rowOff >= temp.height) {
              rowOff = 0
            }
            let idx2 = (colOff + rowOff * temp.width) * 4
            let r = temp.data[idx2 + 0]
            let g = temp.data[idx2 + 1]
            let b = temp.data[idx2 + 2]
            red += r
            green += g
            blue += b
          }
        }

        data.data[idx + 0] = red / 25.0 // 红色通道
        data.data[idx + 1] = green / 25.0 // 绿色通道
        data.data[idx + 2] = blue / 25.0 // 蓝色通道
        data.data[idx + 3] = 255 // 透明度通道
        red = green = blue = 0
      }
    }
  },
  // 浮雕
  relief: function (context, data) {
    let temp = _copyLayer(context, data)
    let h = temp.height
    let w = temp.width
    for (let x = 1; x < w - 1; x++) {
      for (let y = 1; y < h - 1; y++) {
        let idx = (x + y * w) * 4
        let bidx = ((x - 1) + y * w) * 4
        let aidx = ((x + 1) + y * w) * 4

        let nr = temp.data[aidx + 0] - temp.data[bidx + 0] + 128
        let ng = temp.data[aidx + 1] - temp.data[bidx + 1] + 128
        let nb = temp.data[aidx + 2] - temp.data[bidx + 2] + 128
        nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr)
        ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng)
        nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb)

        data.data[idx + 0] = nr
        data.data[idx + 1] = ng
        data.data[idx + 2] = nb
        data.data[idx + 3] = 255
      }
    }
  },
  // 雕刻
  sculpture: function (context, data) {
    let temp = _copyLayer(context, data)
    let h = temp.height
    let w = temp.width
    for (let x = 1; x < w - 1; x++) {
      for (let y = 1; y < h - 1; y++) {
        let idx = (x + y * w) * 4
        let bidx = ((x - 1) + y * w) * 4
        let aidx = ((x + 1) + y * w) * 4

        let nr = temp.data[bidx + 0] - temp.data[aidx + 0] + 128
        let ng = temp.data[bidx + 1] - temp.data[aidx + 1] + 128
        let nb = temp.data[bidx + 2] - temp.data[aidx + 2] + 128
        nr = (nr < 0) ? 0 : ((nr > 255) ? 255 : nr)
        ng = (ng < 0) ? 0 : ((ng > 255) ? 255 : ng)
        nb = (nb < 0) ? 0 : ((nb > 255) ? 255 : nb)

        data.data[idx + 0] = nr
        data.data[idx + 1] = ng
        data.data[idx + 2] = nb
        data.data[idx + 3] = 255
      }
    }
  },
  // 镜像
  mirror: function (context, data) {
    let temp = _copyLayer(context, data)
    for (let x = 0; x < temp.width; x++) {
      for (let y = 0; y < temp.height; y++) {
        let idx = (x + y * temp.width) * 4
        let midx = (((temp.width - 1) - x) + y * temp.width) * 4

        data.data[midx + 0] = temp.data[idx + 0]
        data.data[midx + 1] = temp.data[idx + 1]
        data.data[midx + 2] = temp.data[idx + 2]
        data.data[midx + 3] = 255
      }
    }
  },
  // 黑白
  baw: function (context, data) {
    let temp = _copyLayer(context, data)
    let color = 0
    for (let x = 0; x < temp.width; x++) {
      for (let y = 0; y < temp.height; y++) {
        let idx = (x + y * temp.width) * 4
        let nr = temp.data[idx + 0]
        let ng = temp.data[idx + 1]
        let nb = temp.data[idx + 2]

        let avg = (nr + ng + nb) / 3
        if (avg >= 128) {
          color = 255
        } else {
          color = 0
        }

        data.data[idx + 0] = color
        data.data[idx + 1] = color
        data.data[idx + 2] = color
        data.data[idx + 3] = 255
      }
    }
  }
}
// Canvas copy layer
const _copyLayer = function (context, src) {
  let img = context.createImageData(src.width, src.height)
  img.data.set(src.data)
  return img
}

// IE Version
const _MSIE = (function () {
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
}())

const API = {
  // Canvas Data
  _canvas: null,
  /**
   * @param { Element object } ele 
   * @param { ImageElement Object } img
   */
  init(ele, img) {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    if (!ele) {
      return 'Need to pass in a parent element'
    }
    if (!img) {
      return 'Need to pass in a img element'
    }
    if (!canvas.getContext) {
      return 'Please check if your browser supports canvas'
    }
    if (_MSIE && _MSIE < 10) {
      return 'Please upgrade your browser'
    }
    if (!img.clientWidth || !img.clientHeight) {
      return 'ImageElement Uninitialized'
    }
    canvas.width = img.clientWidth
    canvas.height = img.clientHeight
    // copy to Canvas
    context.drawImage(img, 0, 0, canvas.width, canvas.height)
    ele.innerHTML = ''
    ele.appendChild(canvas)
    this._canvas = canvas
    return true
  },
  /**
   * @param { String } type Filter name 
   * @param { ImageElement Object } img Image to be processed
   * @param { Element Object } ele output canvas
   * @returns Promise object 
   */
  filter(type, ele, img) {
    return new Promise((resolve, reject) => {
      let check = this.init(ele, img)
      if (check !== true) {
        console.error(check)
        throw new Error(check)
      }

      let cvs = this._canvas
      let context = cvs.getContext('2d')

      // get Canvas Data Source
      let canvasData = context.getImageData(0, 0, cvs.width, cvs.height)
      if (!cvs) {
        reject('Uninitialized')
        return
      }
      if (type) {
        // Filter Image
        _filters[type] && _filters[type](context, canvasData, cvs)
        // output			
        context.putImageData(canvasData, 0, 0)
      }
      resolve()
    })
  }
}

export default API
