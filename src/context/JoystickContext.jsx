import { createContext, useState, useEffect } from "react";
import { useGamepads } from 'react-gamepads';

export const JoystickContext = createContext();

export const JoystickContextProvider = ({children})=>{
    
    const [joystick, setJoystick] = useState(null);
    
    const handleGamepadDisconnected = (event) => {
        console.log("Gamepad desconectado:", event.gamepad.id);
        setJoystick(null);
    };

    useEffect(() => {
        window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
        return () => {
            window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
        };
    }, []);

    useGamepads(gamepads => {
        if (gamepads && Object.keys(gamepads).length > 0) {
            // Busca o primeiro controle que não seja nulo na lista
            const firstActiveGamepad = Object.values(gamepads).find(gp => gp !== null && gp !== undefined);
            
            if (firstActiveGamepad) {
                setJoystick(firstActiveGamepad);
            } else {
                setJoystick(null);
            }
        } else {
            setJoystick(null);
        }
    });

    return(
        <JoystickContext.Provider value={{joystick}}>
            {children}
        </JoystickContext.Provider >
    )
}