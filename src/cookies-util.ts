import Cookies from "universal-cookie";

function getCookie(name: string) {
    const cookies = new Cookies();
    return cookies.get(name);
}

const setCookie = (name: string, value: string, options: any) => {
    const cookies = new Cookies();
    cookies.set(name, value, options);
};

const removeCookie = (name: string, options: any) => {
    const cookies = new Cookies();
    cookies.remove(name, options);
};

export { getCookie, setCookie, removeCookie };
