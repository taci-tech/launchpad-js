import { RMContentType } from "./header.js";

/**
 * Parse the body of a request based on the content type.
 * @param body
 * @param contentType
 */
function parseBody(
    contentType: RMContentType | undefined,
    body: any
): string | FormData | URLSearchParams | null {
    switch (contentType) {
        case RMContentType.JSON: {
            return JSON.stringify(body);
        }
        case RMContentType.FORM_DATA: {
            if (body instanceof FormData) {
                return body;
            } else if (body instanceof Object) {
                const formData = new FormData();
                for (const key in body) {
                    formData.append(key, body[key]);
                }
                return formData;
            } else {
                throw new Error("Invalid body type");
            }
        }
        case RMContentType.FORM_URLENCODED: {
            if (body instanceof URLSearchParams) {
                return body;
            } else if (body instanceof Object) {
                const urlSearchParams = new URLSearchParams();
                Object.keys(body).forEach(key => {
                    urlSearchParams.append(key, body[key]);
                });
                return urlSearchParams;
            } else {
                throw new Error("Invalid body type");
            }
        }
    }
    return body;
}

export { parseBody };
