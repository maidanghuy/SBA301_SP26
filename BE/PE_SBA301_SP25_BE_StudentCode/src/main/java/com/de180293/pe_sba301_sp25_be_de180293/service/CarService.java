package com.de180293.pe_sba301_sp25_be_de180293.service;

import com.de180293.pe_sba301_sp25_be_de180293.dto.request.CarCreateRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.request.CarUpdateRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.response.CarResponse;

import java.util.List;

public interface CarService {
    List<CarResponse> getAllCars();
    CarResponse createCar(CarCreateRequest request);
    void deleteCar(Integer carId);
    CarResponse updateCar(Integer carId, CarUpdateRequest request);
    CarResponse recoverCar(Integer carId);
}