package com.de180293.pe_sba301_sp25_be_de180293.controller;

import com.de180293.pe_sba301_sp25_be_de180293.common.ApiResponse;
import com.de180293.pe_sba301_sp25_be_de180293.common.ApiResponses;
import com.de180293.pe_sba301_sp25_be_de180293.dto.request.CarCreateRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.request.CarUpdateRequest;
import com.de180293.pe_sba301_sp25_be_de180293.dto.response.CarResponse;
import com.de180293.pe_sba301_sp25_be_de180293.service.CarService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarsController {

    private final CarService carService;

    // (3) LIST ALL CARS - no permission
    @GetMapping
    public ResponseEntity<ApiResponse<List<CarResponse>>> getAll(HttpServletRequest req) {
        List<CarResponse> data = carService.getAllCars();
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "OK", data, req));
    }

    // (5) ADD NEW CAR - Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<CarResponse>> create(
            @Valid @RequestBody CarCreateRequest request,
            HttpServletRequest req
    ) {
        CarResponse data = carService.createCar(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Created", data, req));
    }

    // (4) DELETE - Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable("id") Integer id,
            HttpServletRequest req
    ) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Deleted", null, req));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody CarUpdateRequest request,
            HttpServletRequest req
    ) {

        CarResponse data = carService.updateCar(id, request);

        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "Updated successfully", data, req)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/recover")
    public ResponseEntity<ApiResponse<CarResponse>> recover(
            @PathVariable Integer id,
            HttpServletRequest req
    ) {
        CarResponse data = carService.recoverCar(id);
        return ResponseEntity.ok(
                ApiResponses.success(HttpStatus.OK, "Recovered successfully", data, req)
        );
    }
}