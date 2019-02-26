# Filter-Images

### Description

- Canvas implements image filter function

### Link

- [Examples](http://www.piszz.com/CanvasFilter/dist)
- [Source](https://github.com/Pszz/CanvasFilter/blob/source/index.js)

### Install

```base
$ npm install filter-images
```

### Using Filter-Images

```javascript
// import package
import filterImages from 'filter-images'

// Basic usage
filterImages.filter(type, element, img)

// Successful callback
filterImages.filter(type, element, img).then(() => {})

// Failure callback
filterImages.filter(type, element, img).catch(() => {})
```

### Parameter

- Type

  _Specify a filter name_

|          type          | Example                           | description            |
| :--------------------: | --------------------------------- | :--------------------- |
| null/false/0/undefined | filter(false, element, img)       | Copy images to Canvas  |
|          baw           | filter('baw', element, img)       | Black and white filter |
|         mirror         | filter('mirror', element, img)    | mirror filter          |
|       sculpture        | filter('sculpture', element, img) | sculpture filter       |
|         invert         | filter('invert, element, img)     | Inverted filter        |
|          gray          | filter('gray', element, img)      | gray filter            |
|          blur          | filter('blur', element, img)      | blur filter            |
|         relief         | filter('relief', element, img)    | Embossing filter       |

- Element

  Pass in a parent element to hold the generated canvas

* Img

  Image to be processed
