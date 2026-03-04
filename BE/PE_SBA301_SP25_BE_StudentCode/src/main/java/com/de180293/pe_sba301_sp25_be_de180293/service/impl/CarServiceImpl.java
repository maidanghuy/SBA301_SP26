package com.de180293.pe_sba301_sp25_be_de180293.service.impl;

import com.de180293.pe_sba301_sp25_be_de180293.dto.request.CarCreateRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.request.CarUpdateRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.response.CarResponse;
import com.de180293.pe_sba301_sp25_be_de180293.entity.PR03Cars;
import com.de180293.pe_sba301_sp25_be_de180293.entity.PR03Country;
import com.de180293.pe_sba301_sp25_be_de180293.exception.ResourceNotFoundException;
import com.de180293.pe_sba301_sp25_be_de180293.repository.PR03CarsRepository;
import com.de180293.pe_sba301_sp25_be_de180293.repository.PR03CountryRepository;
import com.de180293.pe_sba301_sp25_be_de180293.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarServiceImpl implements CarService {

    private final PR03CarsRepository carsRepository;
    private final PR03CountryRepository countryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CarResponse> getAllCars() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = false;

        if (authentication != null && authentication.isAuthenticated()
                && authentication.getAuthorities() != null) {

            isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        List<PR03Cars> cars;

        if (isAdmin) {
            cars = carsRepository.findAll(Sort.by(Sort.Direction.DESC, "carId"));
        } else {
            cars = carsRepository.findByDeleteFlagIsFalse(
                    Sort.by(Sort.Direction.DESC, "carId")
            );
        }

        return cars.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public CarResponse createCar(CarCreateRequest request) {
        PR03Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new ResourceNotFoundException("Country not found"));

        PR03Cars car = PR03Cars.builder()
                .carName(request.getCarName().trim())
                .country(country)
                .unitsInStock(request.getUnitsInStock())
                .unitPrice(request.getUnitPrice())
                .build();

        PR03Cars saved = carsRepository.save(car);

        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteCar(Integer carId) {
        PR03Cars car = carsRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        car.setDeleteFlag(true);
    }

    @Override
    @Transactional
    public CarResponse updateCar(Integer carId, CarUpdateRequest request) {

        PR03Cars car = carsRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        if (Boolean.TRUE.equals(car.getDeleteFlag())) {
            throw new IllegalStateException("Cannot update deleted car");
        }

        // PATCH logic
        if (request.getCarName() != null) {
            car.setCarName(request.getCarName().trim());
        }

        if (request.getUnitsInStock() != null) {
            car.setUnitsInStock(request.getUnitsInStock());
        }

        if (request.getUnitPrice() != null) {
            car.setUnitPrice(request.getUnitPrice());
        }

        if (request.getCountryId() != null) {
            PR03Country country = countryRepository.findById(request.getCountryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Country not found"));
            car.setCountry(country);
        }

        return toResponse(car);
    }

    @Override
    @Transactional
    public CarResponse recoverCar(Integer carId) {

        PR03Cars car = carsRepository.findById(carId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        if (Boolean.FALSE.equals(car.getDeleteFlag())) {
            return toResponse(car);
        }

        car.setDeleteFlag(false);
        return toResponse(car);
    }

    private CarResponse toResponse(PR03Cars c) {

        boolean admin = isAdmin();

        return CarResponse.builder()
                .carId(c.getCarId())
                .carName(c.getCarName())
                .unitsInStock(c.getUnitsInStock())
                .unitPrice(c.getUnitPrice())
                .countryName(c.getCountry() == null ? null : c.getCountry().getCountryName())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .deleteFlag(admin ? c.getDeleteFlag() : null)
                .build();
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) return false;

        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}