import type { SignInRequest } from "@/types/auth";
import axios from "axios";

const api = axios.create({baseURL: "http://localhost:8081"});

export const signIn = (signInRequest : SignInRequest) => 
    api.post("/api/v1/auth/login", signInRequest); 