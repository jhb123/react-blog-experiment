import axios from "axios";


export const BASE_URL = 'http://127.0.0.1:8000'

export const INSTANCE = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
  });
