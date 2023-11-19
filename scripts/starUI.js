"use strict";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var _height = 1200,
    _width = 1500;

// Particle

// Particle

// 粒子

var Particle = function () {
    // 构造函数
    // 粒子类
    // options: 选项对象，包含ctx和index属性
    function Particle(options) {
        _classCallCheck(this, Particle);
        // 上下文
        this._ctx = options.ctx;
        // 粒子属性
        this._props = {};
        // 粒子索引
        this._index = options.index;
        // 初始化粒子
        this.init();
    }

    // 初始化和重置值

    // 初始化粒子
    // Initialize particle
    Particle.prototype.init = function init() {
        // Generate a random angle
        var angle = Math.random() * Math.PI * 2;

        // Set the properties of the particle
        this._props = {
            cur_x: _width / 2 + Math.cos(angle) * 150, // Current x position
            cur_y: _height / 2 + Math.sin(angle) * 150, // Current y position
            speed_x: Math.random() * 1 + .1, // X-axis speed
            speed_y: Math.random() * 1 + .1, // Y-axis speed
            size: Math.random() * 3 + .01, // Size of the particle
            fill: Math.floor(Math.random() * 2) == 1 ? true : false, // Fill or not
            alpha: Math.random() * .5 // Transparency
        };

        // Randomly decide the direction
        this._props.speed_x *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        this._props.speed_y *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    };

    // 查找最近的邻居
    // 有点复杂，需要改进...

    // 查找最近的邻居
    // Find the nearest neighbor
    Particle.prototype.findNearestNeighbor = function findNearestNeighbor(particles) {
        var _neighbor = {},
            _neighbors = particles;

        particles = particles.reverse();

        if (this._index < particles.length - 1) {
            _neighbor = particles[this._index + 1];
        } else {
            _neighbor = particles[0];
        }

        for (var i = 0; i < particles.length; i++) {

            if (i != this._index) {
                var _nX = Math.abs(this._props.cur_x - particles[i]._props.cur_x);
                var _nY = Math.abs(this._props.cur_y - particles[i]._props.cur_y);

                if (_nX < 150 && _nY < 150) {
                    _neighbor = particles[i];
                }
            }
        }

        return _neighbor;
    };

    // 更新

    // 更新
    // Update
    Particle.prototype.update = function update(particles) {
        // Check if the particle is within the canvas boundaries
        if (this._props.cur_x > -150 && this._props.cur_x < _width + 150 && this._props.cur_y > -150 && this._props.cur_y < _height + 150) {
            // Move the particle
            this._props.cur_x += this._props.speed_x;
            this._props.cur_y += this._props.speed_y;
        } else {
            // Reset the particle's position if it is outside the canvas boundaries
            this.init();
        }
    };

    // 渲染

    Particle.prototype.render = function render(particles) {
        this._ctx.beginPath();
        this._ctx.arc(this._props.cur_x, this._props.cur_y, this._props.size, Math.PI * 2, false);

        this._ctx.strokeStyle = "rgba(255,255,255," + this._props.alpha + ")";
        this._ctx.fillStyle = "rgba(255,255,255," + this._props.alpha + ")";

        if (this._props.fill) {
            this._ctx.fill();
        } else {
            this._ctx.stroke();
        }

        this._ctx.beginPath();
        var _neighbor = this.findNearestNeighbor(particles);
        this._ctx.moveTo(this._props.cur_x, this._props.cur_y);
        this._ctx.lineTo(_neighbor._props.cur_x, _neighbor._props.cur_y);
        this._ctx.strokeStyle = "rgba(255,255,255,.03)";
        this._ctx.stroke();
    };

    return Particle;
}();

// World

var World = function () {
    // Construct
    function World() {
        _classCallCheck(this, World);

        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d');
        this._fuzz = {
            src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/40429/noise.jpg',
            // src:'',
            img: null
        };

        this._particles = [];
        this._maxParticles = 150;

        // Preload it
        this.preload();
    }

    // Preload

    World.prototype.preload = function preload() {
        var _this = this;

        var _fuzz = new Image();
        _fuzz.onload = function () {
            _this._fuzz.img = _fuzz;
            _this.build();
            _this.observe();
        };
        _fuzz.src = this._fuzz.src;
    };

    // Listen for sweet events

    World.prototype.observe = function observe() {
        // 监听窗口大小变化事件
        var _this2 = this;

        window.onresize = function () {
            // 更新画布大小
            _this2._canvas.height = _height;
            _this2._canvas.width = _width;
        };
    };

    // Build
    // Build
    // 构建

    World.prototype.build = function build() {
        // 尺寸画布并添加
        this._canvas.height = _height;
        this._canvas.width = _width;
        document.body.appendChild(this._canvas);

        // 粒子
        for (var i = 0; i < this._maxParticles; i++) {
            var _p = new Particle({
                ctx: this._ctx,
                index: i
            });

            this._particles.push(_p);
        }

        // 绘制！
        this.render();
    };

    // Update

    // 更新
    World.prototype.update = function update() {
        // 更新每个粒子
        for (var i = 0; i < this._particles.length; i++) {
            this._particles[i].update();
        }

        // 重新绘制
        this.render();
    };

    // 主渲染

    World.prototype.render = function render() {
        var _this3 = this;

        // 清除画布
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // 绘制背景
        this.renderBackground();

        // 绘制粒子
        for (var i = 0; i < this._particles.length; i++) {
            this._particles[i].render(this._particles);
        }

        // 设置阴影
        this._ctx.shadowBlur = 5 + Math.random() * 5;
        this._ctx.shadowColor = "#f8e5cc";
        this._ctx.fill();

        // 绘制主圆环
        this.renderPrimaryRing();

        // 绘制次圆环
        this.renderSecondaryRing();

        // 绘制模糊效果
        this.renderFuzz();

        // 更新
        requestAnimationFrame(function () {
            return _this3.update();
        });
    };

    World.prototype.renderBackground = function renderBackground() {
        this._ctx.beginPath();
        this._ctx.rect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.fillStyle = "#2b1f1f";
        this._ctx.fill();
    };

    World.prototype.renderPrimaryRing = function renderPrimaryRing() {
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.arc(this._canvas.width / 2, this._canvas.height / 2, 250, Math.PI * 2, false);
        this._ctx.strokeStyle = "#435b74";
        this._ctx.fillStyle = "#435b74";
        this._ctx.lineWidth = 5;
        this._ctx.shadowBlur = 45 + Math.random() * 5;
        this._ctx.shadowColor = "#435b74";
        this._ctx.fill();
        this._ctx.fill();
        this._ctx.restore();
    };

    World.prototype.renderSecondaryRing = function renderSecondaryRing() {
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.arc(this._canvas.width / 2, this._canvas.height / 2, 246, Math.PI * 2, false);
        this._ctx.strokeStyle = "#f8e5cc";
        this._ctx.fillStyle = "#2b1f1f";
        this._ctx.shadowBlur = 15 - Math.random() * 2;
        this._ctx.shadowColor = "#f8e5cc";
        this._ctx.fill();

        // Gradient
        var _g = this._ctx.createRadialGradient(this._canvas.width / 2, this._canvas.height / 2, 250, -750, 500, 0);
        _g.addColorStop(0, '#2b1f1f');
        _g.addColorStop(1, '#435b74');

        this._ctx.fillStyle = _g;
        this._ctx.fill();
        this._ctx.restore();
    };

    World.prototype.renderFuzz = function renderFuzz() {
        this._ctx.save();
        this._ctx.globalAlpha = .065;
        this._ctx.drawImage(this._fuzz.img, 0, 0, this._canvas.width, this._canvas.height);
        this._ctx.restore();
    };

    return World;
}();

new World();