# NinJSu

> Pronounced Ninjutsu\
> Latest version: v1.2.0-alpha

## About

NinJSu is a javascript game development library designed to give maximum control.
It is written in typescript and webgl.

For more information/documentation refer `docs/index.md`

### License

This library is licensed under the GNU Lesser General Public License.

### Usage

Here is a quick setup instruction

- Copy nin.js and nin.css from the dist folder over [here](https://github.com/dragsbruh/ninjsu/).
- Import those files into your html script.
- Import your javascript file.
- Add this boilerplate code:

  ```javascript
  window.addEventListener('DOMContentLoaded', start);
  
  var display;

  function start() {
    // Your initialisation code here
    // This function is called when the game starts
    display = new nin.Display('myCanvasId');
    update();
  }

  function update() {
    // Your game code here
    // This function is called once per frame
    requestAnimationFrame(update);
  }
  ```

- Modify it to suit your needs
- Enjoy
