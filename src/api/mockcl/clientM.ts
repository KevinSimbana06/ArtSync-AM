import axios from "axios";

export const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_MOCK_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});