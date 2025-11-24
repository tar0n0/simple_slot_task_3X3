import * as PIXI from "pixi.js";
import { SYMBOLS, SYMBOL_SIZE, ROWS } from "./constants";
import { SymbolSprite } from "./Symbol";

export class Reel {
    constructor(index, ticker) {
        this.index = index;
        this.ticker = ticker;

        this.container = null;
        this.symbols = [];
        this.speed = 0;
        this.spinning = false;
        this.stopCallback = null;
    }

    createContainer() {
        this.container = new PIXI.Container();
        return this.container;
    }

    init() {
        for (let i = 0; i < ROWS; i++) {
            const symbol = new SymbolSprite(this._randomSymbol());
            symbol.view.y = i * SYMBOL_SIZE + SYMBOL_SIZE / 2;

            this.symbols.push(symbol);
            this.container.addChild(symbol.view);
        }
    }

    _randomSymbol() {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }

    _normalizeSymbols() {
        this.symbols.sort((a, b) => a.view.y - b.view.y);

        for (let i = 0; i < ROWS; i++) {
            this.symbols[i].view.y = i * SYMBOL_SIZE + SYMBOL_SIZE / 2;
        }
    }

    spin(onStop) {
        this.spinning = true;
        this.stopCallback = onStop;
        this.speed = 40;

        let time = 0;
        const duration = 45 + this.index * 20;

        const tick = () => {
            time++;

            for (let i = 0; i < ROWS; i++) {
                const symbol = this.symbols[i];
                const s = symbol.view;

                s.y += this.speed;

                const limit = ROWS * SYMBOL_SIZE; // 300

                if (s.y >= limit + SYMBOL_SIZE / 2) {
                    s.y -= limit;
                    symbol.setSymbol(this._randomSymbol());
                }
            }

            if (time >= duration) {
                this.ticker.remove(tick);
                this.spinning = false;

                this._normalizeSymbols();

                this.stopCallback();
            }
        };

        this.ticker.add(tick);
    }
}
