import { createContext, useState, useEffect, useRef } from "react";

export const JoystickContext = createContext();

export const JoystickContextProvider = ({children}) => {
    const [joystick, setJoystick] = useState(null);
    const requestRef = useRef();

    useEffect(() => {
        const updateJoystick = () => {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            // Varre as portas USB virtuais em busca do controle
            const gp = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];

            if (gp) {
                // Cria um "clone" fresco dos dados para o React atualizar o desenho na tela
                setJoystick({
                    id: gp.id,
                    axes: [...gp.axes],
                    buttons: gp.buttons.map(b => ({ pressed: b.pressed, value: b.value }))
                });
            }
            
            // Loop mágico: chama essa mesma função 60 vezes por segundo
            requestRef.current = requestAnimationFrame(updateJoystick);
        };

        const handleConnect = (e) => {
            console.log("🎮 Controle conectado!", e.gamepad.id);
            // Inicia o vídeo/loop assim que conectar
            requestRef.current = requestAnimationFrame(updateJoystick);
        };

        const handleDisconnect = (e) => {
            console.log("❌ Controle desconectado.");
            cancelAnimationFrame(requestRef.current);
            setJoystick(null);
        };

        window.addEventListener("gamepadconnected", handleConnect);
        window.addEventListener("gamepaddisconnected", handleDisconnect);

        // Se o controle já estiver plugado antes da página carregar:
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            if (gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3]) {
                requestRef.current = requestAnimationFrame(updateJoystick);
            }
        }

        // Limpeza de segurança
        return () => {
            window.removeEventListener("gamepadconnected", handleConnect);
            window.removeEventListener("gamepaddisconnected", handleDisconnect);
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <JoystickContext.Provider value={{ joystick }}>
            {children}
        </JoystickContext.Provider>
    );
};