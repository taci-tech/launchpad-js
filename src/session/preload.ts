import cookie from "cookie";

interface LPSessionPreload {
    cookies: {
        [key: string]: string;
    };
}

function preloadParseCookies(req: any): LPSessionPreload {
    return {
        cookies: cookie.parse(req ? req.headers.cookie || "" : document.cookie),
    };
}

// TODO: This is still a work in progress.
function preloadLPSession(page: any): any {
    if (page.getInitialProps) {
        const originalGetInitialProps = page.getInitialProps;
        page.getInitialProps = async (context: any) => {
            const originalInitialProps = await originalGetInitialProps(context);
            return {
                ...originalInitialProps,
                preload: preloadParseCookies(context.req),
            };
        };
    } else {
        page.getInitialProps = async (context: any) => {
            return {
                preload: preloadParseCookies(context.req),
            };
        };
    }
    return page;
}

export { preloadLPSession, LPSessionPreload };
