package com.lacvn.controller;

import com.lacvn.dto.response.OrderDetailResponseDTO;
import com.lacvn.dto.response.OrderResponseDTO;
import com.lacvn.service.OrderService;
import com.lacvn.service.impl.UserDetailsServiceImpl;
import com.lacvn.utils.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Test
    void getCurrentUserOrders_ShouldReturnOrders() throws Exception {
        OrderResponseDTO orderDTO = OrderResponseDTO.builder()
                .id("123")
                .total(new BigDecimal("100.00"))
                .status("PENDING")
                .createdAt(Instant.now())
                .build();

        when(orderService.getCurrentUserOrders()).thenReturn(Collections.singletonList(orderDTO));

        mockMvc.perform(get("/api/v1/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data[0].id").value("123"));
    }

    @Test
    void getOrderDetail_ShouldReturnOrderDetail() throws Exception {
        OrderDetailResponseDTO orderDetailDTO = OrderDetailResponseDTO.builder()
                .id("123")
                .total(new BigDecimal("100.00"))
                .build();
        
        when(orderService.getOrderDetail("123")).thenReturn(orderDetailDTO);

        mockMvc.perform(get("/api/v1/orders/123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.id").value("123"));
    }
}
