package com.lacvn.service;

import com.lacvn.dto.request.ShippingMethodRequest;
import com.lacvn.dto.response.ShippingMethodResponse;
import com.lacvn.entity.ShippingMethod;

import java.util.List;

public interface ShippingMethodService {
    List<ShippingMethodResponse> getAllShippingMethods();

    ShippingMethodResponse getShippingMethodById(Long id);

    ShippingMethodResponse createShippingMethod(ShippingMethodRequest request);

    ShippingMethodResponse updateShippingMethod(Long id, ShippingMethodRequest request);

    void deleteShippingMethod(Long id);
}
