import axiosClient from "./axiosClient";

const countryService = {
    list: () => axiosClient.get("/countries"),
};

export default countryService;
