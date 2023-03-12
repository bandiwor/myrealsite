import axios from "axios";
import BACKENDURLS from "../auth/BACKENDURLS";
import useCookie from "../hooks/useCookie";
import useStorage from "../hooks/useStorage";

const refreshUrl = BACKENDURLS.url+BACKENDURLS.refreshToken;

const getTokens = () => {
    return [useCookie.get('accessToken'), useStorage.get('refreshToken')];
}

const getNewAccessToken = async (url, refresh, setError) => {
    try {
        const response = await axios.post(url, {
            refreshToken: refresh
        })

        return response.data.accessToken;

    } catch (error) {
        console.error(error);
        setError(error)
        return null;
    }
}

const sendPostRequest = async (url, body, headers, [isLoaded, setIsLoaded], [response, setResponse], [_, setError]) => {
    try {
        const _response = await axios.post(url, body, {
            headers: headers
        });
        setResponse(_response);
        setIsLoaded(true);

    } catch (error) {
        console.log(error)
        setIsLoaded(true);
        setError(error);
    }
}

const request = (
    url, [isLoaded, setIsLoaded], [response, setResponse], [error, setError], body={}, _headers={}
) => {
    const request_func = async () => {
        const [accessToken, refreshToken] = getTokens();

        if (accessToken !== null) {
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                ..._headers
            }
            console.log(headers);

            await sendPostRequest(url, body, headers,
                [isLoaded, setIsLoaded],
                [response, setResponse],
                [error, setError]);

        } else if (refreshToken != null) {
            const newAccessToken = await getNewAccessToken(refreshUrl, refreshToken, setError);
            const cookieExpTime = useCookie.getExpTime(newAccessToken);
            useCookie.set('accessToken', newAccessToken, cookieExpTime);

            const headers = {
                Authorization: `Bearer ${newAccessToken}`,
                ..._headers
            }

            await sendPostRequest(url, body, headers,
                [isLoaded, setIsLoaded],
                [response, setResponse],
                [error, setError]);

        } else {
            const headers = {
                ..._headers
            }

            await sendPostRequest(url, body, headers,
                [isLoaded, setIsLoaded],
                [response, setResponse],
                [error, setError]);
        }
    }
    void request_func();
}

export default request;