namespace nin {
	class GLUtil {
		public static initgl(canvas: HTMLCanvasElement): WebGLRenderingContext {
			let gl = canvas.getContext('webgl');

			if (gl === null) {
				console.warn('Nani?! WebGL is not available. Using experimental-webgl.');
				gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext;
			}
			if (gl === null) {
				throw new Error('Nani?! Browser does not support WebGL.');
			}
			return gl;
		}
		public static fillScissor(color: Color, gl: WebGLRenderingContext, rect: Rect, canvas: HTMLCanvasElement) {
			gl.enable(gl.SCISSOR_TEST);
			gl.scissor(rect.x, canvas.height - (rect.height + rect.y), rect.width, rect.height); // TODO: Change this when rect properties are implemented.
			gl.clearColor(...color._get_gl_compatible());
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.disable(gl.SCISSOR_TEST);
		}

		// TODO: Highly experimental!! Not Implemented
		public static readonly vertexShaderSource: string = "\nattribute vec2 position;\n\nvoid main() {\n  gl_Position = vec4(position, 0.0, 1.0);\n}\n";
		public static readonly fragmentShaderSource: string = "\nprecision mediump float;\nuniform sampler2D texture;\nvarying vec2 texCoord;\n\nvoid main() {\n  gl_FragColor = texture2D(texture, texCoord);\n}\n";
	}

	export class Display {
		private _canvas: HTMLCanvasElement;
		private _gl: WebGLRenderingContext;
		private _id: string | undefined;
		constructor(canvasId?: string) {
			let canvas;
			if (canvasId !== undefined) {
				let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
				if (canvas === null) {
					throw new Error("Nani?! Canvas with canvasId ${canvasId} does not exist...");
				}
				canvas.classList.add('nin-game-canvas');
				this._canvas = canvas as HTMLCanvasElement;
				this._id = canvasId;
			} else {
				canvas = document.createElement('canvas') as HTMLCanvasElement;
				canvas.classList.add('nin-game-canvas');
				this._canvas = canvas as HTMLCanvasElement;
				this._id = undefined;
			}
			this._gl = GLUtil.initgl(this._canvas);
		}
		public fill(color: Color, rect?: Rect) {
			if (color === undefined) {
				return;
			}
			if (rect === undefined) {
				this._gl.clearColor(...color._get_gl_compatible());
				this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
			} else {
				GLUtil.fillScissor(color, this._gl, rect, this._canvas);
			}
		}
		public _get_gl_context(): WebGLRenderingContext {
			return this._gl;
		}
		public _get_canvas_element(): HTMLCanvasElement {
			return this._canvas;
		}
	}

	export class Color {
		private _R: number;
		private _G: number;
		private _B: number;
		private _A: number;
		public is8bit: boolean;
		constructor(r: number, g: number, b: number, a: number, is8bit: boolean) {
			this._R = r;
			this._G = g;
			this._B = b;
			this._A = a;
			this.is8bit = is8bit;
			this._check_colors();
		}
		public _get_gl_compatible(): [number, number, number, number] {
			if (this.is8bit) {
				return [this.R / 255, this.G / 255, this.B / 255, this.A / 255];
			} else {
				return [this.R, this.G, this.B, this.A];
			}
		}
		public _check_colors() {
			for (let color of this._get_gl_compatible()) {
				if (color > 1 || color < 0) {
					throw new Error('Nani?! Invalid color value.');
				}
			}
		}
		get R() { return this._R; }
		get G() { return this._G; }
		get B() { return this._B; }
		get A() { return this._A; }

		set R(value: number) { this._R = value; this._check_colors(); }
		set G(value: number) { this._G = value; this._check_colors(); }
		set B(value: number) { this._B = value; this._check_colors(); }
		set A(value: number) { this._A = value; this._check_colors(); }
	}

	export class Rect {
		private _x: number;
		private _y: number;
		private _width: number;
		private _height: number;

		constructor(x: number, y: number, width: number, height: number) {
			this._x = x;
			this._y = y;
			this._width = width;
			this._height = height;
		}
		get x(): number { return this._x };
		get y(): number { return this._y };
		get width(): number { return this._width };
		get height(): number { return this._height };
		get centerx(): number { return this._x + (this._width / 2); };
		get centery(): number { return this._y + (this._height / 2); };
		get center(): [number, number] { return [this.centerx, this.centery]; };
		get left(): number { return this._x; };
		get right(): number { return this._x + this._width; };
		get top(): number { return this._y; };
		get bottom(): number { return this._y + this._height; };

		set x(value: number) { // TODO: The below part is experimental. Needs verification.
			this._x = value;
		}
		set y(value: number) {
			this._y = value;
		}
		set width(value: number) {
			this._width = value;
		}
		set height(value: number) {
			this._height = value;
		}
		set center(value: [number, number]) {
			this._x = value[0] - (this.width / 2);
			this._y = value[1] - (this.height / 2);
		}
		set centerx(value: number) {
			this._x = value - (this.width / 2);
		}
		set centery(value: number) {
			this._y = value - (this.height / 2);
		}
		set left(value: number) {
			this._x = value;
		}
		set right(value: number) {
			this._x = value + this.width;
		}
		set top(value: number) {
			this._y = value;
		}
		set bottom(value: number) {
			this._y = value + this.height;
		}

		public collidepoint(point: [number, number]): boolean {
			if (point[0] > this.left && point[0] < this.right) {
				if (point[1] > this.top && point[1] < this.bottom) {
					return true;
				}
			}
			return false;
		}
	}

	export class mouse {
		public static pressed: [boolean, boolean, boolean] = [false, false, false]; // LEFT, MIDDLE, RIGHT
		public static pos: [number, number] = [0, 0];
		public static inctx: boolean = false; // Represents if the mouse is in canvas

		public static enable_mouse(display: Display) {
			const canvas = display._get_canvas_element();

			const canvas_rect = canvas.getBoundingClientRect();
			const offsetX = canvas_rect.left;
			const offsetY = canvas_rect.top;

			canvas.addEventListener('mousemove', (e) => {
				const x = e.clientX - offsetX;
				const y = e.clientY - offsetY;
				mouse.pos = [x, y];
			});

			canvas.addEventListener('mouseenter', () => {
				mouse.inctx = true;
			});

			canvas.addEventListener('mouseleave', () => {
				mouse.inctx = false;
			});

			canvas.addEventListener('mousedown', (e) => {
				mouse.handle_mouse_press(e.button, true);
			});

			canvas.addEventListener('mouseup', (e) => {
				mouse.handle_mouse_press(e.button, false);
			});
		}

		private static handle_mouse_press = (button: number, down: boolean) => {
			mouse.pressed[button] = down;
		};
	}
}