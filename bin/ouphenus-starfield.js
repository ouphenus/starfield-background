"use strict";
console.log('Ophenus Starfield');
var OuphenusStarField;
(function (OuphenusStarField) {
    /* -------------------------------------------------------
        Class Ticker
    -------------------------------------------------------*/
    class Ticker {
        constructor(onTickCaller, onTickCallback) {
            this.lastTime = Date.now();
            this.onTickCaller = onTickCaller;
            this.onTickCallback = onTickCallback;
            requestAnimationFrame(() => this.onTick());
        }
        onTick() {
            let currentTime = Date.now();
            let deltaTime = currentTime - this.lastTime;
            this.onTickCallback.call(this.onTickCaller, deltaTime);
            this.lastTime = Date.now();
            requestAnimationFrame(() => this.onTick());
        }
    }
    OuphenusStarField.Ticker = Ticker;
    /* -------------------------------------------------------
        Image
    -------------------------------------------------------*/
    class Image {
        constructor(url) {
            this.baseWidth = 0;
            this.baseHeight = 0;
            this.source = document.createElement('img');
            this.source.src = url;
            this.source.onload = () => this.onLoad();
        }
        onLoad() {
            this.baseWidth = this.source.width;
            this.baseHeight = this.source.height;
        }
    }
    OuphenusStarField.Image = Image;
    /* -------------------------------------------------------
        Sprite
    -------------------------------------------------------*/
    class Sprite {
        constructor(image, x, y, sx, sy) {
            this.image = image;
            this.x = x;
            this.y = y;
            this.sx = sx;
            this.sy = sy;
        }
        onDraw(context) {
            context.drawImage(this.image.source, this.x, this.y, this.image.baseWidth * this.sx, this.image.baseWidth * this.sy);
        }
    }
    OuphenusStarField.Sprite = Sprite;
    /* -------------------------------------------------------
        Star
    -------------------------------------------------------*/
    class Star extends Sprite {
        constructor(image, x, y, sx, sy, vx, vy) {
            super(image, x, y, sx, sy);
            this.xo = x;
            this.yo = y;
            this.vx = vx;
            this.vy = vy;
            this.time = 0;
        }
        update(context, dt) {
            // MRU Ecuaciónes de movimiento
            //https://es.wikipedia.org/wiki/Movimiento_rectil%C3%ADneo_uniforme
            this.time += dt;
            this.x = this.xo + this.vx * this.time;
            this.y = this.yo + this.vy * this.time;
            this.onDraw(context);
        }
    }
    OuphenusStarField.Star = Star;
    /* -------------------------------------------------------
        Main Application
    -------------------------------------------------------*/
    class Main {
        constructor() {
            this.appWidth = 0;
            this.appHeight = 0;
            this.canvas = this.createCanvas();
            this.context = this.canvas.getContext('2d');
            this.ticker = new Ticker(this, this.update);
            this.canvas.style.position = 'absolute';
            this.canvas.style.left = '0px';
            this.canvas.style.top = '0px';
            this.stars = new Array();
            let img = new Image('images/star.png');
        }
        update(dt) {
            if (this.context != null) {
                this.context.clearRect(0, 0, this.appWidth, this.appHeight);
                this.context.fillRect(0, 0, this.appWidth, this.appHeight);
            }
            if (this.appWidth != window.innerWidth || this.appHeight != window.innerHeight) {
                this.onResize();
            }
        }
        onResize() {
            this.appWidth = window.innerWidth;
            this.appHeight = window.innerHeight;
            this.canvas.width = this.appWidth;
            this.canvas.height = this.appHeight;
        }
        createCanvas() {
            let canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            return canvas;
        }
    }
    OuphenusStarField.Main = Main;
})(OuphenusStarField || (OuphenusStarField = {}));
let starfield = new OuphenusStarField.Main();
//# sourceMappingURL=ouphenus-starfield.js.map