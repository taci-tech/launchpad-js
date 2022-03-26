import { RMContentType, RMHeaderEncoded } from "./header.js";

class RMUtils {
    static headerToObject = (header: RMHeaderEncoded): { [p: string]: string } => {
        const result: { [key: string]: string } = {};
        if (
            header.contentType
            && header.contentType !== RMContentType.FORM_DATA
            // We do not include the content-type in the header if it is FORM_DATA.
            // This is because the content-type is automatically set by the browser.
            // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
        ) {
            result['Content-Type'] = header.contentType;
        }
        if (header.authorization) {
            result['Authorization'] = header.authorization;
        }
        if (header.extends) {
            for (const key in header.extends) {
                result[key] = header.extends[key];
            }
        }
        return result;
    };

    static stringToContentType(contentType: string): RMContentType {
        switch (contentType) {
            case 'application/json':
                return RMContentType.JSON;
            case 'application/x-www-form-urlencoded':
                return RMContentType.FORM_URLENCODED;
            case 'multipart/form-data':
                return RMContentType.FORM_DATA;
            default:
                return RMContentType.PLAIN_TEXT;
        }
    }
}

export { RMUtils };
