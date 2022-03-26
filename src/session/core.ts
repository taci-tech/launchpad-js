import React, { useEffect, useState } from "react";
import { LPSession, LPSessionRequestHandlerProps } from "./interface.js";
import { RequestHandler, RHConfigBasics } from "../request-handler/core.js";
import { getCookie } from "../cookies-util.js";
import { LPSessionPreload } from "./preload.js";

function useLPSession<ValType>(
    session: LPSession<ValType>,
    params?: { preload?: LPSessionPreload }
) {
    const [sessionStateValue, setSessionStateValue] = useState(
        session.onStart({ preload: params?.preload }),
    );
    const [sessionError, setSessionError] = useState(
        null
    );
    const [sessionIsLoading, setSessionIsLoading] = useState(
        session.shouldDefaultLoading || false
    );
    const [sessionExposedSetter, setSessionExposedSetter] = useState(
        undefined
    );

    /**
     * This state is to make rhConfigBasics persistent between different overrides.
     */
    const [rhConfigBasics, setRhConfigBasics] = useState<RHConfigBasics | undefined>(
        undefined
    );

    /**
     * A function convert the session-hooked RH handler to general RH handler.
     * @param handler The session-hooked RH handler.
     */
    function convertHandler(
        handler: {
            [key: number]: (props: LPSessionRequestHandlerProps<ValType>) => void
        } | undefined,
    ): { [key: number]: (data: any) => void } {
        const rhHandler: { [key: number]: (data: any) => void } = {};

        if (handler) {
            for (const key in handler) {
                rhHandler[key] = (data: any) => {
                    handler[key]({
                        data: data,
                        state: sessionStateValue,
                        setState: setSessionStateValue,
                        setIsLoading: setSessionIsLoading,
                        setError: setSessionError,
                    });
                };
            }
        }

        return rhHandler;
    }

    /**
     * The function to be executed when the session is started or reset.
     */
    function executeOnMount(): void {
        if (session.onMount) {
            session.onMount({
                state: sessionStateValue,
                setState: setSessionStateValue,
                setIsLoading: setSessionIsLoading,
                setError: setSessionError,
            });
        }

        if (
            session.requestHandlerConfig
            && session.requestHandlerConfig.shouldRunOnMount !== false
        ) {
            if (
                session.shouldHaveAuthorization
                && getCookie(session.tokenCookieKey || "_lp_session_token") !== "1"
            ) {
                setSessionStateValue(session.onStart({}));
                if (session.onAuthorizationFail) {
                    session.onAuthorizationFail({
                        state: sessionStateValue,
                        setState: setSessionStateValue,
                        setIsLoading: setSessionIsLoading,
                        setError: setSessionError,
                    });
                }
                return;
            }

            const rhConfig = session.requestHandlerConfig;
            const rhHandler = convertHandler(rhConfig.handler);

            RequestHandler.make({
                method: rhConfig.method,
                path: rhConfig.path,
                config: rhConfig.config,
                handler: { ...rhHandler },
                onStart: () => {
                    rhConfig.onStart && rhConfig.onStart({
                        state: sessionStateValue,
                        setState: setSessionStateValue,
                        setIsLoading: setSessionIsLoading,
                        setError: setSessionError,
                    });
                },
                onUpdate: () => {
                    rhConfig.onUpdate && rhConfig.onUpdate({
                        state: sessionStateValue,
                        setState: setSessionStateValue,
                        setIsLoading: setSessionIsLoading,
                        setError: setSessionError,
                    });
                },
                onFinish: () => {
                    rhConfig.onFinish && rhConfig.onFinish({
                        state: sessionStateValue,
                        setState: setSessionStateValue,
                        setIsLoading: setSessionIsLoading,
                        setError: setSessionError,
                    });
                },
                onError: (error: any) => {
                    rhConfig.onError && rhConfig.onError({
                        error: error,
                        setState: setSessionStateValue,
                        setIsLoading: setSessionIsLoading,
                        setError: setSessionError,
                    });
                },
            });
        }
    }

    useEffect(() => {
        executeOnMount();
        return () => {
            if (session.onUnmount) {
                session.onUnmount({
                    state: sessionStateValue,
                });
            }
            setSessionIsLoading(false);
        };
    }, []);

    useEffect(() => {
        if (sessionExposedSetter !== undefined) {
            if (session.onOverride) {
                session.onOverride({
                    newValue: sessionExposedSetter,
                    state: sessionStateValue,
                    setState: setSessionStateValue,
                    setIsLoading: setSessionIsLoading,
                    setError: setSessionError,
                });
            }
            if (session.requestHandlerConfig) {
                const rhConfig = session.requestHandlerConfig;
                const rhHandlers = convertHandler(rhConfig.handler);

                const defaultBasics: RHConfigBasics = {
                    path: rhConfig.path,
                    config: rhConfig.config,
                };

                const basics = (
                    rhConfig.onOverride ? rhConfig.onOverride({
                        rhConfig: rhConfigBasics || defaultBasics,
                        newValue: sessionExposedSetter,
                        state: sessionStateValue,
                        setState: setSessionStateValue,
                        setIsLoading: setSessionIsLoading,
                        setError: setSessionError,
                    }) : defaultBasics
                ) || undefined;

                if (
                    session.shouldHaveAuthorization
                    && getCookie("_lp_session_validation") !== "1"
                ) {
                    setSessionStateValue(session.onStart({}));
                } else if (basics) {
                    if (rhConfig.continuousConfig) {
                        setRhConfigBasics(basics);
                    }

                    RequestHandler.make({
                        ...basics,
                        method: rhConfig.method,
                        handler: { ...rhHandlers },
                        onStart: () => {
                            rhConfig.onStart && rhConfig.onStart({
                                state: sessionStateValue,
                                setState: setSessionStateValue,
                                setIsLoading: setSessionIsLoading,
                                setError: setSessionError,
                            });
                        },
                        onUpdate: () => {
                            rhConfig.onUpdate && rhConfig.onUpdate({
                                state: sessionStateValue,
                                setState: setSessionStateValue,
                                setIsLoading: setSessionIsLoading,
                                setError: setSessionError,
                            });
                        },
                        onFinish: () => {
                            rhConfig.onFinish && rhConfig.onFinish({
                                state: sessionStateValue,
                                setState: setSessionStateValue,
                                setIsLoading: setSessionIsLoading,
                                setError: setSessionError,
                            });
                        },
                        onError: (error: any) => {
                            rhConfig.onError && rhConfig.onError({
                                error: error,
                                setState: setSessionStateValue,
                                setIsLoading: setSessionIsLoading,
                                setError: setSessionError,
                            });
                        },
                    });
                }
            }
        }
    }, [sessionExposedSetter]);

    const sessionReset = () => {
        setSessionStateValue(session.onStart({ preload: params?.preload }));
        setSessionError(null);
        setSessionIsLoading(session.shouldDefaultLoading || false);
        setSessionExposedSetter(undefined);
        setRhConfigBasics(undefined);
        executeOnMount();
    };

    return {
        data: sessionStateValue,
        setData: (newValue?: any) => {
            setSessionExposedSetter(newValue);
        },
        isLoading: sessionIsLoading,
        error: sessionError,
        reset: sessionReset,
    };
}

export * from './preload.js';
export * from './interface.js';
export { useLPSession };
