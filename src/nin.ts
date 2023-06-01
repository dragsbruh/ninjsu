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
		public fill(color: Color) {
			if (color === undefined) {
				return
			}
			this._gl.clearColor(...color._get_gl_compatible())
			this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT)
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
}