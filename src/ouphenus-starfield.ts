console.log('Ophenus Starfield');

namespace OuphenusStarField
{
    /* -------------------------------------------------------
        Class Ticker
    -------------------------------------------------------*/
    export class Ticker
    {
        lastTime:number;
        onTickCaller:Object;
        onTickCallback:(dt:number)=>void;

        constructor(onTickCaller:Object, onTickCallback:(dt:number)=>void)
        {
            this.lastTime = Date.now();
            this.onTickCaller = onTickCaller;
            this.onTickCallback = onTickCallback;
            requestAnimationFrame(()=>this.onTick());
        }

        public onTick():void
        {
            let currentTime:number = Date.now();
            let deltaTime = currentTime - this.lastTime;
            this.onTickCallback.call(this.onTickCaller, deltaTime);
            this.lastTime = Date.now();
            requestAnimationFrame(()=>this.onTick());
        }
    }

    /* -------------------------------------------------------
        Image
    -------------------------------------------------------*/
    export class Image
    {
        source:HTMLImageElement;
        baseWidth:number = 0;
        baseHeight:number = 0;

        constructor(url:string)
        {
            this.source = document.createElement('img');
            this.source.src = url;
            this.source.onload = ()=> this.onLoad();
        }

        onLoad():void
        {
            this.baseWidth = this.source.width;
            this.baseHeight = this.source.height;
        }
    }

    /* -------------------------------------------------------
        Sprite
    -------------------------------------------------------*/
    export class Sprite
    {
        image:Image;
        x:number;
        y:number;
        sx:number;
        sy:number;

        constructor(image:Image, x:number, y:number, sx:number,sy:number)
        {
            this.image = image;
            this.x = x;
            this.y = y;
            this.sx = sx;
            this.sy = sy;
        }

        public onDraw(context:CanvasRenderingContext2D):void
        {
            context.drawImage(this.image.source, this.x, this.y,
                this.image.baseWidth * this.sx, this.image.baseWidth * this.sy);
        }
    }

    /* -------------------------------------------------------
        Star
    -------------------------------------------------------*/
    export class Star extends Sprite
    {
        xo:number;
        yo:number;
        vx:number;
        vy:number;
        time:number;

        constructor(image:Image, x:number, y:number, sx:number,sy:number, vx:number, vy:number)
        {
            super(image, x, y, sx, sy);
            this.xo = x;
            this.yo = y;
            this.vx = vx;
            this.vy = vy;
            this.time = 0;
        }

        public update(context:CanvasRenderingContext2D, dt:number):void
        {
            // MRU Ecuaciónes de movimiento
            //https://es.wikipedia.org/wiki/Movimiento_rectil%C3%ADneo_uniforme
            this.time += dt;
            this.x = this.xo + this.vx * this.time;
            this.y = this.yo + this.vy * this.time;
            this.onDraw(context);
        }
    }

    /* -------------------------------------------------------
        Main Application
    -------------------------------------------------------*/
    export class Main
    {
        appWidth:number;
        appHeight:number;
        context:CanvasRenderingContext2D | null;
        canvas:HTMLCanvasElement;
        ticker:Ticker;
        stars:Array<Star>;

        constructor()
        {
            this.appWidth = 0;
            this.appHeight = 0;
            this.canvas = this.createCanvas();
            this.context = this.canvas.getContext('2d');
            this.ticker = new Ticker(this, this.update);

            this.canvas.style.position = 'absolute';
            this.canvas.style.left = '0px';
            this.canvas.style.top = '0px';

            this.stars = new Array<Star>();
            let img = new Image('images/star.png');
        }

        public update(dt:number):void
        {
            if (this.context != null)
            {
                this.context.clearRect(0, 0, this.appWidth, this.appHeight);
                this.context.fillRect(0, 0, this.appWidth, this.appHeight);
            }

            if (this.appWidth != window.innerWidth || this.appHeight != window.innerHeight)
            {
                this.onResize();
            }
        }

        public onResize():void
        {
            this.appWidth = window.innerWidth;
            this.appHeight = window.innerHeight;
            this.canvas.width = this.appWidth;
            this.canvas.height = this.appHeight;
        }

        private createCanvas():HTMLCanvasElement
        {
            let canvas:HTMLCanvasElement = document.createElement('canvas');
            document.body.appendChild(canvas);
            return canvas;
        }
    }
}

let starfield = new OuphenusStarField.Main();
