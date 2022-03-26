import React, { useEffect } from "react";
import { LPConfiguration } from "./config-util.js";

interface LaunchpadProviderProps {
    config?: { [key: string]: string };
    children: React.ReactNode;
}

const LaunchpadProvider = (props: LaunchpadProviderProps) => {
    for (const key in props.config) {
        LPConfiguration[key] = props.config[key];
    }

    useEffect(() => {
        for (const key in props.config) {
            LPConfiguration[key] = props.config[key];
        }
    }, [props.config]);

    return props.children;
};

export { LaunchpadProvider };
