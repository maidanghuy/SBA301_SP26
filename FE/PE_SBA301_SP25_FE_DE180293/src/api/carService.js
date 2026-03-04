import axiosClient from "./axiosClient";

// endpoints correspond to backend REST API implemented in Spring
const carService = {
    list: () => axiosClient.get("/cars"),
    get: (id) => axiosClient.get(`/cars/${id}`),
    create: (car) => axiosClient.post("/cars", car),
    update: (id, car) => axiosClient.patch(`/cars/${id}`, car),
    remove: (id) => axiosClient.delete(`/cars/${id}`),
    recover: (id) => axiosClient.patch(`/cars/${id}/recover`, { carId: id }),
};

export default carService;
