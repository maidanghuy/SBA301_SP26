package com.lacvn.service;

import com.lacvn.dto.response.OrderDetailResponseDTO;
import com.lacvn.dto.response.OrderResponseDTO;

import java.util.List;

public interface OrderService {
    List<OrderResponseDTO> getCurrentUserOrders();
    OrderDetailResponseDTO getOrderDetail(String orderId);
}
