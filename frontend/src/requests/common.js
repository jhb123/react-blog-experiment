import axios from "axios";

export const INSTANCE = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 1000,
  });
