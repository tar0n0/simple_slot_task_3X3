import { useEffect, useRef, useState } from "react";
import { SlotGame } from "./pixi/SlotGame";

import './App.css'

export default function App() {
    const canvasRef = useRef(null);
    const [game, setGame] = useState(null);
    const [msg, setMsg] = useState("Press SPIN");


    useEffect(() => {
        if (!canvasRef.current || game) return;

        const g = new SlotGame(canvasRef.current, (result) => {
            setMsg(result === "win" ? "Win!" : "Try again");
        });

        g.init();
        setGame(g);
    }, []);
    const onSpin = () => {
        if (!game || game.spinning) return;
        setMsg("");
        game.spin();
    };

    const disabled = game?.spinning;

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "radial-gradient(circle at top, #303a52 0%, #141414 55%, #050505 100%)",
                color: "#fff",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    style={{ display: "block", margin: "0 auto" }}
                />

                <button
                    onClick={onSpin}
                    disabled={disabled}

                    style={{
                        marginTop: 24,
                        padding: "12px 40px",
                        fontSize: 18,
                        fontWeight: 600,
                        borderRadius: 999,
                        border: "none",
                        cursor: disabled ? "default" : "pointer",
                        background: disabled
                            ? "linear-gradient(135deg, #555, #333)"
                            : "linear-gradient(135deg, #ffb347, #ff7b00)",
                        color: "#111",
                        boxShadow: disabled
                            ? "0 0 0 rgba(0,0,0,0)"
                            : "0 8px 20px rgba(0,0,0,0.6)",
                    }}
                >
                    SPIN
                </button>

                <h2
                    className={msg === "Win!" ? "win-blink" : ""}
                    style={{
                        marginTop: 16,
                        minHeight: "1.7em",
                    }}
                >
                    {msg || "\u00A0"}
                </h2>
            </div>
        </div>
    );
}
