"use strict";
var nin;
(function (nin) {
    var GLUtil = (function () {
        function GLUtil() {
        }
        GLUtil.initgl = function (canvas) {
            var gl = canvas.getContext('webgl');
            if (gl === null) {
                console.warn('Nani?! WebGL is not available. Using experimental-webgl.');
                gl = canvas.getContext('experimental-webgl');
            }
            if (gl === null) {
                throw new Error('Nani?! Browser does not support WebGL.');
            }
            return gl;
        };
        GLUtil.fillScissor = function (color, gl, rect, canvas) {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(rect.x, canvas.height - (rect.height + rect.y), rect.width, rect.height);
            gl.clearColor.apply(gl, color._get_gl_compatible());
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.disable(gl.SCISSOR_TEST);
        };
        GLUtil.vertexShaderSource = "\nattribute vec2 position;\n\nvoid main() {\n  gl_Position = vec4(position, 0.0, 1.0);\n}\n";
        GLUtil.fragmentShaderSource = "\nprecision mediump float;\nuniform sampler2D texture;\nvarying vec2 texCoord;\n\nvoid main() {\n  gl_FragColor = texture2D(texture, texCoord);\n}\n";
        return GLUtil;
    }());
    var Display = (function () {
        function Display(canvasId) {
            var canvas;
            if (canvasId !== undefined) {
                var canvas_1 = document.getElementById(canvasId);
                if (canvas_1 === null) {
                    throw new Error("Nani?! Canvas with canvasId ${canvasId} does not exist...");
                }
                canvas_1.classList.add('nin-game-canvas');
                this._canvas = canvas_1;
                this._id = canvasId;
            }
            else {
                canvas = document.createElement('canvas');
                canvas.classList.add('nin-game-canvas');
                this._canvas = canvas;
                this._id = undefined;
            }
            this._gl = GLUtil.initgl(this._canvas);
        }
        Display.prototype.fill = function (color, rect) {
            var _a;
            if (color === undefined) {
                return;
            }
            if (rect === undefined) {
                (_a = this._gl).clearColor.apply(_a, color._get_gl_compatible());
                this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
            }
            else {
                GLUtil.fillScissor(color, this._gl, rect, this._canvas);
            }
        };
        Display.prototype._get_gl_context = function () {
            return this._gl;
        };
        Display.prototype._get_canvas_element = function () {
            return this._canvas;
        };
        return Display;
    }());
    nin.Display = Display;
    var Color = (function () {
        function Color(r, g, b, a, is8bit) {
            this._R = r;
            this._G = g;
            this._B = b;
            this._A = a;
            this.is8bit = is8bit;
            this._check_colors();
        }
        Color.prototype._get_gl_compatible = function () {
            if (this.is8bit) {
                return [this.R / 255, this.G / 255, this.B / 255, this.A / 255];
            }
            else {
                return [this.R, this.G, this.B, this.A];
            }
        };
        Color.prototype._check_colors = function () {
            for (var _i = 0, _a = this._get_gl_compatible(); _i < _a.length; _i++) {
                var color = _a[_i];
                if (color > 1 || color < 0) {
                    throw new Error('Nani?! Invalid color value.');
                }
            }
        };
        Object.defineProperty(Color.prototype, "R", {
            get: function () { return this._R; },
            set: function (value) { this._R = value; this._check_colors(); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "G", {
            get: function () { return this._G; },
            set: function (value) { this._G = value; this._check_colors(); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "B", {
            get: function () { return this._B; },
            set: function (value) { this._B = value; this._check_colors(); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "A", {
            get: function () { return this._A; },
            set: function (value) { this._A = value; this._check_colors(); },
            enumerable: false,
            configurable: true
        });
        return Color;
    }());
    nin.Color = Color;
    var Rect = (function () {
        function Rect(x, y, width, height) {
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        }
        Object.defineProperty(Rect.prototype, "x", {
            get: function () { return this._x; },
            set: function (value) {
                this._x = value;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "y", {
            get: function () { return this._y; },
            set: function (value) {
                this._y = value;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "width", {
            get: function () { return this._width; },
            set: function (value) {
                this._width = value;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "height", {
            get: function () { return this._height; },
            set: function (value) {
                this._height = value;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "centerx", {
            get: function () { return this._x + (this._width / 2); },
            set: function (value) {
                this._x = value - (this.width / 2);
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "centery", {
            get: function () { return this._y + (this._height / 2); },
            set: function (value) {
                this._y = value - (this.height / 2);
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "center", {
            get: function () { return [this.centerx, this.centery]; },
            set: function (value) {
                this._x = value[0] - (this.width / 2);
                this._y = value[1] - (this.height / 2);
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "left", {
            get: function () { return this._x; },
            set: function (value) {
                this._x = value;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "right", {
            get: function () { return this._x + this._width; },
            set: function (value) {
                this._x = value + this.width;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "top", {
            get: function () { return this._y; },
            set: function (value) {
                this._y = value;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(Rect.prototype, "bottom", {
            get: function () { return this._y + this._height; },
            set: function (value) {
                this._y = value + this.height;
            },
            enumerable: false,
            configurable: true
        });
        ;
        Rect.prototype.collidepoint = function (point) {
            if (point[0] > this.left && point[0] < this.right) {
                if (point[1] > this.top && point[1] < this.bottom) {
                    return true;
                }
            }
            return false;
        };
        return Rect;
    }());
    nin.Rect = Rect;
    var mouse = (function () {
        function mouse() {
        }
        mouse.enable_mouse = function (display) {
            var canvas = display._get_canvas_element();
            var canvas_rect = canvas.getBoundingClientRect();
            var offsetX = canvas_rect.left;
            var offsetY = canvas_rect.top;
            canvas.addEventListener('mousemove', function (e) {
                var x = e.clientX - offsetX;
                var y = e.clientY - offsetY;
                mouse.pos = [x, y];
            });
            canvas.addEventListener('mouseenter', function () {
                mouse.inctx = true;
            });
            canvas.addEventListener('mouseleave', function () {
                mouse.inctx = false;
            });
            canvas.addEventListener('mousedown', function (e) {
                mouse.handle_mouse_press(e.button, true);
            });
            canvas.addEventListener('mouseup', function (e) {
                mouse.handle_mouse_press(e.button, false);
            });
        };
        mouse.pressed = [false, false, false];
        mouse.pos = [0, 0];
        mouse.inctx = false;
        mouse.handle_mouse_press = function (button, down) {
            mouse.pressed[button] = down;
        };
        return mouse;
    }());
    nin.mouse = mouse;
})(nin || (nin = {}));
