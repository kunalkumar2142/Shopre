import axios from "axios";
import { config } from "process";

const api = axios.create({baseURL: 'http://localhost:8081'});

api.interceptors.request.use((config) => {
    if(config.url?.startsWith("/api/v1/auth")){
        return config;
    }

    const userSession = localStorage.get("userSession");
    if(userSession){
        const { token } =JSON.parse(userSession);
    }
})