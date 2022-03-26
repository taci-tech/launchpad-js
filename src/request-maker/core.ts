import { LPConfiguration } from "../config-util.js";
import { parseBody } from "./body.js";
import { RMContentType, RMHeader, RMHeaderEncoded } from "./header.js";
import { RMMethod } from "./method.js";
import { RMUtils } from "./utils.js";
import { getCookie } from "../cookies-util.js";

interface RMConfig {
    body?: any;
    header?: RMHeader;
    query?: { [key: string]: string },
    contentType?: RMContentType;
    passToken?: boolean,
    tokenCookieKey?: string,
}

class RMCore {
    private readonly url: string;

    private readonly method: RMMethod;
    private readonly header: RMHeaderEncoded;
    private readonly body: any;
    private readonly query: { [key: string]: string };

    constructor(
        method: RMMethod,
        path: string,
        config: RMConfig
    ) {
        if (path.length === 0) {
            path = "/";
        }
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }

        // Generate the url based on the path and the config server url.
        this.url = LPConfiguration.server + path;

        this.method = method;
        this.header = {
            contentType: (
                config.contentType
                || (
                    config.header ? (
                        RMUtils.stringToContentType(config.header["Content-Type"])
                        || RMContentType.JSON
                    ) : RMContentType.JSON
                )
            ),
            extends: config.header || {},
        };
        this.body = config.body || undefined;
        this.query = config.query || {};

        if (config.passToken) {
            const cookieUserToken = getCookie(config.tokenCookieKey || "_lp_session_token");
            if (cookieUserToken) {
                this.header.authorization = 'Bearer ' + cookieUserToken;
            }
        }
    }

    static create(
        method: RMMethod,
        path: string,
        config?: RMConfig
    ) {
        return new RMCore(method, path, config || {});
    }

    getUrl(): string {
        return this.url;
    }

    getMethod(): string {
        return this.method;
    }

    getHeader(): RMHeader {
        return RMUtils.headerToObject(this.header);
    }

    getBody(): any {
        return this.body;
    }

    auth(token: string): void {
        this.header.authorization = 'Bearer ' + token;
    }

    async manualMake() {
        return await fetch(this.makeRequestInfo(), this.makeRequestInit());
    }

    makeRequestInfo(): RequestInfo {
        let queryPath = '';
        if (Object.entries(this.query).length > 0) {
            const queryValues: string[] = [];
            Object.entries(this.query).forEach(entry => {
                if (entry[1] !== undefined) {
                    queryValues.push(entry[0] + '=' + entry[1]);
                }
            });
            queryPath = queryValues.join('&');
        }

        return this.url + (queryPath.length > 0 ? '?' + queryPath : '');
    }

    makeRequestInit(): RequestInit {
        return {
            method: this.method,
            headers: RMUtils.headerToObject(this.header),
            body: parseBody(this.header.contentType, this.body),
        };
    }

    /**
     * [RequestMaker] Make a GET request with the given RMConfig.
     *
     * @param {string} path The path of the request (do not include root domain).
     * @param {RMConfig} config The configuration of the request.
     * @returns {Promise<Response>}
     */
    static async get(
        path: string,
        config?: RMConfig
    ) {
        return RMCore.make(RMMethod.GET, path, config);
    }

    /**
     * [RequestMaker] Make a POST request with the given RMConfig.
     *
     * @param {string} path The path of the request (do not include root domain).
     * @param {RMConfig} config The configuration of the request.
     * @returns {Promise<Response>}
     */
    static async post(
        path: string,
        config?: RMConfig
    ) {
        return RMCore.make(RMMethod.POST, path, config);
    }

    /**
     * [RequestMaker] Make a GET request with the given RMConfig.
     *
     * @param {RMMethod} method The method of the request.
     * @param {string} path The path of the request (do not include root domain).
     * @param {RMConfig} config The configuration of the request.
     * @returns {Promise<Response>}
     */
    static async make(
        method: RMMethod,
        path: string,
        config?: RMConfig
    ) {
        const request = new RMCore(method, path, config || {});
        return await request.manualMake();
    }
}

export {
    RMCore as RequestMaker,
    RMConfig,
    RMContentType,
    RMHeader,
    RMMethod,
    RMUtils,
};
