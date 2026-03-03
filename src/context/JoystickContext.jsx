import { createContext, useState, useEffect } from "react";

export const JoystickContext = createContext();

export const JoystickContextProvider = ({children}) => {
    const [joystick, setJoystick] = useState(null);

    useEffect(() => {
        // Função que roda assim que você aperta um botão
        const handleConnect = (e) => {
            console.log("🎮 Controle detectado nativamente:", e.gamepad.id);
            setJoystick(e.gamepad);
        };

        // Função que roda se você puxar o cabo
        const handleDisconnect = (e) => {
            console.log("❌ Controle desconectado.");
            setJoystick(null);
        };

        // Liga os "ouvintes" diretos do navegador
        window.addEventListener("gamepadconnected", handleConnect);
        window.addEventListener("gamepaddisconnected", handleDisconnect);

        // Varredura de segurança: força a checagem caso o controle já estivesse conectado
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] !== null) {
                    console.log("🎮 Controle já estava plugado:", gamepads[i].id);
                    setJoystick(gamepads[i]);
                    break;
                }
            }
        }

        return () => {
            window.removeEventListener("gamepadconnected", handleConnect);
            window.removeEventListener("gamepaddisconnected", handleDisconnect);
        };
    }, []);

    return (
        <JoystickContext.Provider value={{ joystick }}>
            {children}
        </JoystickContext.Provider>
    );
};