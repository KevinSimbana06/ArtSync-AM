import Axios from "axios";

export const client = Axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'Accept': 'application/json'
    }
});

