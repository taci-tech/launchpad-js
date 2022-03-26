import { RMConfig, RMMethod } from "../request-maker/core.js";
import { RHConfigBasics } from "../request-handler/core.js";
import { LPSessionPreload } from "./preload.js";

interface LPSessionMountProps<ValType> {
    state: ValType | null,
    setState: (value: ValType | null) => void,
    setIsLoading: (value: boolean) => void,
    setError: (error: any) => void,
}

interface LPSessionUnmountProps<ValType> {
    state: ValType | null,
}

interface LPSessionOverrideProps<ValType> {
    newValue: any,
    state: ValType | null,
    setState: (value: ValType | null) => void,
    setIsLoading: (value: boolean) => void,
    setError: (error: any) => void,
}

interface LPSessionTrackingUpdateProps<ValType> {
    value: ValType | null,
    setState: (value: ValType | null) => void,
    setError: (error: any) => void,
}

interface LPSessionRequestHandlerProps<ValType> extends LPSessionMountProps<ValType> {
    data: any,
}

interface LPSessionRequestHandlerErrorProps<ValType> {
    error: any,
    setState: (value: ValType | null) => void,
    setIsLoading: (value: boolean) => void,
    setError: (error: any) => void,
}

interface LPSessionTrackingConfiguration<ValType> {
    path: string,
    onUpdate: (props: LPSessionTrackingUpdateProps<ValType>) => void,
}

interface LPSessionRequestHandlerConfiguration<ValType> {
    shouldRunOnMount?: boolean,
    continuousConfig?: boolean,
    path?: string,
    method: RMMethod,
    config?: RMConfig,
    handler?: { [key: number]: (props: LPSessionRequestHandlerProps<ValType>) => void },
    onStart?: (props: LPSessionMountProps<ValType>) => void,
    onOverride?: (props: {
        rhConfig: RHConfigBasics,
        newValue: any,
        state: ValType | null,
        setState: (value: ValType | null) => void,
        setIsLoading: (value: boolean) => void,
        setError: (error: any) => void,
    }) => RHConfigBasics | null,
    onUpdate?: (props: LPSessionMountProps<ValType>) => void,
    onFinish?: (props: LPSessionMountProps<ValType>) => void,
    onError?: (props: LPSessionRequestHandlerErrorProps<ValType>) => void,
}

/**
 * The launchpad session object.
 */
interface LPSession<ValType> {
    tokenCookieKey?: string,
    shouldDefaultLoading?: boolean,
    shouldHaveAuthorization?: boolean,
    trackingConfig?: LPSessionTrackingConfiguration<ValType>, // TODO: This is still a work in progress.
    requestHandlerConfig?: LPSessionRequestHandlerConfiguration<ValType>,
    onStart: (props: { preload?: LPSessionPreload }) => (ValType | null),
    onMount?: ((props: LPSessionMountProps<ValType>) => void),
    onUnmount?: ((props: LPSessionUnmountProps<ValType>) => void),
    onOverride?: ((props: LPSessionOverrideProps<ValType>) => void),
    onAuthorizationFail?: ((props: LPSessionMountProps<ValType>) => void),
}

export {
    LPSessionRequestHandlerProps,
    LPSession,
};
