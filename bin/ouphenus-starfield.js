export var OuphenusStarField;
(function (OuphenusStarField) {
    // -------------------------------------------------------
    // Clase Utils
    // -------------------------------------------------------
    class Utils {
        static range(min, max) {
            return min + ((max - min) * Math.random());
        }
        static rangeInt(min, max) {
            return Math.round(min + ((max - min) * Math.random()));
        }
    }
    OuphenusStarField.Utils = Utils;
    // -------------------------------------------------------
    // Clase Ticker
    // -------------------------------------------------------
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
    // -------------------------------------------------------
    // Clase Image
    // -------------------------------------------------------
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
    // -------------------------------------------------------
    // Clase Sprite
    // -------------------------------------------------------
    class Sprite {
        constructor(image, x, y, sx, sy) {
            this.image = image;
            this.x = x;
            this.y = y;
            this.sx = sx;
            this.sy = sy;
            this.alpha = 1;
        }
        onDraw(context) {
            context.save();
            context.globalAlpha = this.alpha;
            context.translate(-this.image.baseWidth * 0.5 * this.sx, -this.image.baseHeight * 0.5 * this.sx);
            context.drawImage(this.image.source, this.x, this.y, this.image.baseWidth * this.sx, this.image.baseWidth * this.sy);
            context.restore();
        }
    }
    OuphenusStarField.Sprite = Sprite;
    // -------------------------------------------------------
    // Clase Star
    // -------------------------------------------------------
    class Star extends Sprite {
        constructor(x, y, sx, sy, speed, angle, acceleration) {
            let image = Star.starsImages[Utils.rangeInt(0, Star.starsImages.length - 1)];
            super(image, x, y, sx, sy);
            this.xo = x;
            this.yo = y;
            this.vx = speed * Math.cos(angle);
            this.vy = speed * Math.sin(angle);
            this.scaleLifeTime = sx;
            this.time = 0;
            this.acceleration = acceleration;
            this.alpha = 0;
            this.isFade = Math.random() < 0.7;
        }
        update(context, dt) {
            this.time += dt;
            this.scaleLifeTime += 0.000015 * dt;
            if (this.isFade) {
                this.alpha += 0.0015 * dt;
            }
            else {
                this.alpha = Math.sin(this.time * 0.005);
            }
            this.sx = this.sy = this.scaleLifeTime;
            // MRUV Ecuaciónes de movimiento
            // https://es.wikipedia.org/wiki/Movimiento_rectil%C3%ADneo_uniformemente_acelerado
            this.x = this.xo + this.vx * this.time +
                0.5 * this.acceleration * this.time * this.time * Math.sign(this.vx);
            this.y = this.yo + this.vy * this.time +
                0.5 * this.acceleration * this.time * this.time * Math.sign(this.vy);
            this.onDraw(context);
        }
        // Setenado una lista estática de Imágenes
        static setupStarsImages(urlsListStarsImages) {
            for (var i = 0; i < urlsListStarsImages.length; i++) {
                Star.starsImages.push(new Image(urlsListStarsImages[i]));
            }
        }
    }
    Star.starsImages = new Array();
    OuphenusStarField.Star = Star;
    // -------------------------------------------------------
    // Clase Main Application
    // -------------------------------------------------------
    class Main {
        constructor() {
            this.banner = null;
            let logStar = String.fromCodePoint(9733, 9733, 9733);
            console.log(logStar, 'Ophenus Starfield', logStar);
            this.appWidth = 0;
            this.appHeight = 0;
            this.canvas = this.createCanvas();
            this.context = this.canvas.getContext('2d');
            this.ticker = new Ticker(this, this.update);
            this.canvas.style.position = 'absolute';
            this.stars = new Array();
            this.timerToCreate = 1000;
        }
        createBanner() {
            this.banner = new Sprite(new Image('images/banner.png'), 0, 0, 8, 8);
        }
        update(dt) {
            if (this.context != null) {
                this.context.clearRect(0, 0, this.appWidth, this.appHeight);
                this.context.fillRect(0, 0, this.appWidth, this.appHeight);
                // Actulizando cada Estrella
                for (let i = this.stars.length - 1; i >= 0; i--) {
                    this.stars[i].update(this.context, dt);
                    // Eliminando 'star' si estan fuera de la pantalla
                    if ((this.stars[i].x < 0 || this.stars[i].x > this.appWidth) ||
                        (this.stars[i].y < 0 || this.stars[i].y > this.appHeight)) {
                        this.stars.splice(i, 1);
                    }
                }
                // Actulizando valores del Banner
                if (this.banner != null) {
                    if (this.banner.sx >= 0.7) {
                        this.banner.sx -= 0.0009 * dt;
                        this.banner.sy -= 0.0009 * dt;
                    }
                    this.banner.x = window.innerWidth * 0.5;
                    this.banner.y = window.innerHeight * 0.5;
                    this.banner.onDraw(this.context);
                }
            }
            // Cooldown Timer para crear nuevas estrellas
            this.timerToCreate -= dt;
            if (this.timerToCreate <= 0) {
                this.createStars();
                this.timerToCreate = this.range(100, 800);
            }
            if (this.appWidth != window.innerWidth || this.appHeight != window.innerHeight) {
                this.onResize();
            }
        }
        // Creando estrellas aleatoriamente
        createStars() {
            let numStars = this.range(20, 80);
            let centerX = this.appWidth * 0.5;
            let centerY = this.appHeight * 0.5;
            for (let i = 0; i < numStars; i++) {
                let x = this.range(centerX - 500, centerX + 500);
                let y = this.range(centerY - 500, centerY + 500);
                let scale = this.range(0.07, 0.12);
                let speed = this.range(0.05, 0.2);
                let angle = Math.atan2(y - centerY, x - centerX);
                let acceleration = this.range(0.00001, 0.0003);
                let star = new Star(x, y, scale, scale, speed, angle, acceleration);
                this.stars.push(star);
            }
        }
        onResize() {
            // Actulizando las dimensiones del Canvas
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
        range(min, max) {
            return min + ((max - min) * Math.random());
        }
    }
    OuphenusStarField.Main = Main;
})(OuphenusStarField || (OuphenusStarField = {}));
//# sourceMappingURL=ouphenus-starfield.js.map