import { RMMethod } from "../request-maker/method.js";
import { RequestMaker, RMConfig } from "../request-maker/core.js";

interface RHConfigBasics {
    path?: string,
    config?: RMConfig,
}

interface RHConfigWithoutMethod extends RHConfigBasics {
    handler?: { [key: number]: (data: any) => void },
    onStart?: () => void,
    onUpdate?: () => void,
    onFinish?: () => void,
    onError?: (error: any) => void,
}

interface RHConfig extends RHConfigWithoutMethod {
    method: RMMethod,
}

class RHCore {
    static make(config: RHConfig): void {
        // Notify the user that the 'handler' may be misspelled.
        // eslint-disable-next-line no-prototype-builtins
        if (!config.handler && config.hasOwnProperty("handlers")) {
            console.warn("The handler property is not defined but there is another property called 'handlers' found. Did you mean 'handler'?");
        }

        if (!config.path) {
            return;
        }

        // This variable is to take the response code from status extraction to content process.
        let responseCode = 0;

        if (config.onStart) {
            config.onStart();
        }

        RequestMaker.make(config.method, config.path, config.config)
            .then(response => {
                if (config.onUpdate) {
                    config.onUpdate();
                }

                if (
                    config.handler
                    && Object.keys(config.handler).includes(response.status.toString())
                ) {
                    responseCode = response.status;
                    return response.json();
                } else {
                    return undefined;
                }
            }).then(data => {
                if (data) {
                    if (config.handler) {
                        if (config.handler[responseCode]) {
                            config.handler[responseCode](data);
                        } else if (config.handler[0]) {
                            config.handler[0](data);
                        }
                    }
                }
                if (config.onFinish) {
                    config.onFinish();
                }
            }).catch(error => {
                if (config.onError) {
                    config.onError(error);
                }
            });
    }

    static get(config: RHConfigWithoutMethod): void {
        RHCore.make({
            ...config,
            method: RMMethod.GET,
        });
    }

    static post(config: RHConfigWithoutMethod): void {
        RHCore.make({
            ...config,
            method: RMMethod.POST,
        });
    }
}

export {
    RHCore as RequestHandler,
    RHConfigBasics,
    RHConfigWithoutMethod,
    RHConfig,
};
