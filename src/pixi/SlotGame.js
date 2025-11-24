import * as PIXI from "pixi.js";
import gsap from "gsap";
// import { Spine } from "@pixi-spine/runtime-3.8";

import {
    REELS,
    REEL_WIDTH,
    ROWS,
    SYMBOL_SIZE,
} from "./constants";

import { Reel } from "./Reel";

export class SlotGame {
    constructor(canvas, onResult) {
        this.onResult = onResult;
        this.spinning = false;
        this.reels = [];

        this.app = new PIXI.Application({
            view: canvas,
            width: 640,
            height: 480,
            background: "#111",
            antialias: true,
        });

        globalThis.__PIXI_APP__ = this.app;

        this.boardContainer = new PIXI.Container();
        this.app.stage.addChild(this.boardContainer);

        this.reelsContainer = new PIXI.Container();
        this.boardContainer.addChild(this.reelsContainer);

        this.spineContainer = new PIXI.Container();
        this.boardContainer.addChild(this.spineContainer);

        this.effectsContainer = new PIXI.Container();
        this.boardContainer.addChild(this.effectsContainer);
    }

    async init() {
        // await this._loadSpine();
        this._createBoard();
        this._createReels();
    }

    // async _loadSpine() {
    //     const spineData = await PIXI.Assets.load("/animations/coin/web/coins.json");
    //
    //
    //     this.coinsSpine = new Spine(spineData);
    //     this.coinsSpine.scale.set(0.45);
    //
    //     this.coinsSpine.visible = false;
    //
    //     this.spineContainer.addChild(this.coinsSpine);
    // }

    // _playCoins() {
    //     if (!this.coinsSpine) return;
    //
    //     this.coinsSpine.visible = true;
    //     this.coinsSpine.state.setAnimation(0, "coin_2", true);
    // }

    // _stopCoins() {
    //     if (!this.coinsSpine) return;
    //     this.coinsSpine.visible = false;
    //     this.coinsSpine.state.clearTracks();
    // }

    _createBoard() {
        const boardWidth = REELS * REEL_WIDTH;
        const boardHeight = ROWS * SYMBOL_SIZE;

        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;

        this.boardContainer.x = (this.app.screen.width - boardWidth) / 2;
        this.boardContainer.y = (this.app.screen.height - boardHeight) / 2;

        // this.coinsSpine.x = boardWidth / 2;
        // this.coinsSpine.y = -50;

        const g = new PIXI.Graphics();
        g.beginFill(0x151515);
        g.drawRoundedRect(-20, -20, boardWidth + 40, boardHeight + 40, 20);
        g.endFill();

        g.lineStyle(3, 0x444444);
        g.drawRoundedRect(-5, -5, boardWidth + 10, boardHeight + 10, 14);

        g.lineStyle(2, 0x333333);
        for (let i = 1; i < REELS; i++) {
            g.moveTo(i * REEL_WIDTH, 0);
            g.lineTo(i * REEL_WIDTH, boardHeight);
        }

        this.boardContainer.addChildAt(g, 0);
    }

    _createReels() {
        for (let i = 0; i < REELS; i++) {
            const reel = new Reel(i, this.app.ticker);
            const container = reel.createContainer();

            container.x = i * REEL_WIDTH;
            reel.init();

            this.reels.push(reel);
            this.reelsContainer.addChild(container);

            const mask = new PIXI.Graphics();
            mask.beginFill(0xffffff);
            mask.drawRect(0, 0, REEL_WIDTH, ROWS * SYMBOL_SIZE);
            mask.endFill();

            container.addChild(mask);
            container.mask = mask;
        }
    }

    spin() {
        if (this.spinning) return;

        // this._stopCoins();
        this.effectsContainer.removeChildren();

        this.spinning = true;
        let stopped = 0;

        this.reels.forEach((reel) => {
            reel.spin(() => {
                stopped++;
                if (stopped === REELS) {
                    this._checkWin();
                }
            });
        });
    }

    _checkWin() {
        const wins = [];

        for (let row = 0; row < ROWS; row++) {
            const a = this.reels[0].symbols[row].value;
            const b = this.reels[1].symbols[row].value;
            const c = this.reels[2].symbols[row].value;

            if (a === b && b === c) wins.push(row);
        }

        this.spinning = false;

        if (wins.length > 0) {
            // this._playCoins();
            this._animateWin(wins);
            this.onResult("win");
        } else {
            this.onResult("lose");
        }
    }

    _animateWin(rows) {
        rows.forEach((row) => {
            this._drawWinLine(row);
            this._animateWinSymbols(row);
        });
    }

    _drawWinLine(row) {
        const line = new PIXI.Graphics();

        line.lineStyle(6, 0xffff00, 0.9);
        line.moveTo(0, row * SYMBOL_SIZE + SYMBOL_SIZE / 2);
        line.lineTo(this.boardWidth, row * SYMBOL_SIZE + SYMBOL_SIZE / 2);

        this.effectsContainer.addChild(line);

        gsap.fromTo(line, { alpha: 0 }, { alpha: 1, duration: 0.25, repeat: 5, yoyo: true });
    }

    _animateWinSymbols(row) {
        for (let i = 0; i < this.reels.length; i++) {
            const sprite = this.reels[i].symbols[row].view;

            gsap.to(sprite.scale, {
                x: 1.3,
                y: 1.3,
                duration: 0.35,
                repeat: 3,
                yoyo: true,
            });

            gsap.to(sprite, {
                alpha: 0.6,
                duration: 0.3,
                repeat: 3,
                yoyo: true,
            });
        }
    }
}
