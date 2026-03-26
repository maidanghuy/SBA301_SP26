package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.dto.response.OrderDetailResponseDTO;
import com.lacvn.dto.response.OrderResponseDTO;
import com.lacvn.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getCurrentUserOrders(HttpServletRequest request) {
        List<OrderResponseDTO> orders = orderService.getCurrentUserOrders();
        return ResponseEntity.ok(ApiResponses.ok(orders, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDetailResponseDTO>> getOrderDetail(@PathVariable String id, HttpServletRequest request) {
        OrderDetailResponseDTO orderDetail = orderService.getOrderDetail(id);
        return ResponseEntity.ok(ApiResponses.ok(orderDetail, request));
    }
}
