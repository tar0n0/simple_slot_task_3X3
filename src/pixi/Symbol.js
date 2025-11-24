import * as PIXI from "pixi.js";
import { SYMBOL_SIZE, REEL_WIDTH } from "./constants";

export class SymbolSprite {
    constructor(value) {
        this.value = value;

        this.view = new PIXI.Text(value, {
            fontSize: SYMBOL_SIZE * 0.8,
            fontWeight: "600",
            fontFamily: "Arial",
        });

        this.view.anchor.set(0.5);
        this.view.x = REEL_WIDTH / 2;
    }

    setSymbol(v) {
        this.value = v;
        this.view.text = v;
    }
}
