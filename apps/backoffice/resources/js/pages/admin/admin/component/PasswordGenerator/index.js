import React, { useState, useEffect } from "react";
import ReactSlider from "react-slider";

const PasswordGenerator = () => {
    const [length, setLength] = useState(12);
    const [digits, setDigits] = useState(4);
    const [symbols, setSymbols] = useState(2);
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState("");

    const generatePassword = () => {
        const charset = {
            lower: "abcdefghijklmnopqrstuvwxyz",
            upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            digits: "0123456789",
            symbols: "!@#$%^&*()_+{}:\"<>?|[];',./`~"
        };

        let generatedPassword = "";
        let availableCharset = charset.lower + charset.upper;

        for (let i = 0; i < digits; i++) {
            availableCharset += charset.digits;
        }

        for (let i = 0; i < symbols; i++) {
            availableCharset += charset.symbols;
        }

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * availableCharset.length);
            generatedPassword += availableCharset[randomIndex];
        }

        setPassword(generatedPassword);
        calculateStrength(generatedPassword);
    };

    const calculateStrength = (password) => {
        let strength = "Weak";
        if (password.length > 10) strength = "Medium";
        if (password.length > 15 && /[\d!@#$%^&*()_+{}:"<>?|[\];',./`~]/.test(password)) strength = "Strong";
        setStrength(strength);
    };

    useEffect(() => {
        generatePassword();
    }, [length, digits, symbols]);

    return (
        <div className="password-generator container mt-4 p-4 border rounded">
            <h2>Generate Password</h2>
            <div className="password-display input-group mb-3">
                <input type="text" className="form-control" value={password} readOnly />
                <button className="btn btn-outline-secondary" onClick={generatePassword}>
                    <i className="uil-redo"></i>
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(password)}>
                    <i className="uil-copy"></i>
                </button>
            </div>
            <div className="password-strength mb-3">
                <label className="form-label">Strength</label>
                <div className={`progress mb-1`}>
                    <div
                        className={`progress-bar ${strength.toLowerCase()}`}
                        role="progressbar"
                        style={{ width: `${strength === "Strong" ? 100 : strength === "Medium" ? 66 : 33}%` }}
                        aria-valuenow={strength === "Strong" ? 100 : strength === "Medium" ? 66 : 33}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>
                <span>{strength}</span>
            </div>
            <div className="slider-container mb-3">
                <label className="form-label">Length</label>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    value={length}
                    min={4}
                    max={64}
                    step={1}
                    onChange={(value) => setLength(value)}
                />
            </div>
            <div className="slider-container mb-3">
                <label className="form-label">Digits</label>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    value={digits}
                    min={0}
                    max={10}
                    step={1}
                    onChange={(value) => setDigits(value)}
                />
            </div>
            <div className="slider-container mb-3">
                <label className="form-label">Symbols</label>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    value={symbols}
                    min={0}
                    max={10}
                    step={1}
                    onChange={(value) => setSymbols(value)}
                />
            </div>
        </div>
    );
};

export default PasswordGenerator;