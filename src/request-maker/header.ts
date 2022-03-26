enum RMContentType {
    PLAIN_TEXT = 'text/plain',
    JSON = 'application/json',
    FORM_DATA = 'multipart/form-data',
    FORM_URLENCODED = 'application/x-www-form-urlencoded',
}

/**
 * [RequestMaker] The header interface of the request maker.
 */
interface RMHeader {
    [key: string]: string;
}

interface RMHeaderEncoded {
    contentType?: RMContentType;
    authorization?: string;
    extends: {
        [key: string]: string;
    };
}

export { RMContentType, RMHeader, RMHeaderEncoded };
