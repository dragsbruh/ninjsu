"use strict";
var nin;
(function (nin) {
    var GLUtil = /** @class */ (function () {
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
        return GLUtil;
    }());
    var Display = /** @class */ (function () {
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
        Display.prototype.fill = function (color) {
            var _a;
            if (color === undefined) {
                return;
            }
            (_a = this._gl).clearColor.apply(_a, color._get_gl_compatible());
            this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
        };
        return Display;
    }());
    nin.Display = Display;
    var Color = /** @class */ (function () {
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
})(nin || (nin = {}));
