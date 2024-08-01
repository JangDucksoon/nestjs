import axios from "axios";
import properties from "../property/config";

export const axiosInstance = axios.create({
    baseURL: properties.API_SERVER,
    timeout: 3000,
    headers: { 'Content-Type': 'application/json'}
});

export const axiosMultipartInstance = axios.create({
    baseURL: properties.API_SERVER,
    timeout: 3000,
    headers: { 'Content-Type': 'multipart/form-data'}
})


