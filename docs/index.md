## Welcome to GitHub Pages

### [Demo](demo.html)

### Install

- NPM

  ```sh
  npm install vue-cv-annotation
  ```

  ```javascript
  import Vue from 'vue';
  import Anno from 'vue-cv-annotation';
  import 'vue-cv-annotation/dist/Annotation.css';

  // Global Registration
  Vue.component('anno', Anno);

  // or Local Registration
  const ComponentA = {
    components: {
      anno: Anno,
    },
    // ...
  };
  ```

- HTML

  ```html
  <script src="https://unpkg.com/vue@3.2.25/dist/vue.global.prod.js"></script>
  <script src="https://unpkg.com/vue-cv-annotation@latest"></script>
  <script>
    Vue.component('anno', window.Annotation);
  </script>
  ```

### Config

- Props

  ```javascript
  {
    src: String, // img src
    mode: Number, // 0: edit, 1: preview
    annos: Item[], // annotation array
    maskColor: String, // annotation's color in mode 1 (set transparent if not need)
    scaleable: Boolean, // img scaleable
    separable: Boolean, // can a annotation contain more than one shape
  }

  // Item
  {
    // annotation id define by yourself
    id: 1,
    // annotation type, 0: points, 1: line, 2: bbox, 3: segmentation
    type: 0,
    // category color in order
    cat: 1, // category color in order (64 colors now)
    // 0: no outline, 1: show outline only, 2: show outline and title
    outline: 2,
    // title of annotation
    title: 'title',
    // array of annotation(array of fragment(array of point(x, y)))
    // type 2 need 2 point for every fragment, type 3 need at least 3, check by youself
    data: [[[x0, y0], ... ], ... ],
  }

  ```

- Method

  ```javascript
  // reset the image scale
  reset()

  // get painter data in edit mode, with your meta data
  getPainter()

  //set data shown in edit mode
  setPainter({type: 0, data: [[x0, x1], ...], ...yourMetaData}) //set data shown in edit mode

  ```

- Event

  - **@img-load** image loaded
  - **@anno-click** anno click, emit anno.id

- Operation

  - **scale image:** wheel
  - **move image:** right drag
  - **add point in order:** click
  - **add point near(segmentation):** shift+click
  - **remove point:** right click
  - **move point:** drag
  - **new fregment:** ctrl+click
