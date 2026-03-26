package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.PageResponse;
import com.lacvn.dto.response.ProductDetailResponse;
import com.lacvn.dto.response.ProductSummaryResponse;
import com.lacvn.service.ProductService;
import com.lacvn.service.impl.UserDetailsServiceImpl;
import com.lacvn.utils.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Test
    void getProducts_ShouldReturnPage() throws Exception {
        ProductSummaryResponse product = ProductSummaryResponse.builder()
                .id("prod-1")
                .name("Test Product")
                .build();

        PageResponse<ProductSummaryResponse> page = PageResponse.<ProductSummaryResponse>builder()
                .content(Collections.singletonList(product))
                .page(0)
                .size(10)
                .totalElements(1)
                .totalPages(1)
                .build();

        when(productService.getProducts(any(), any(), any(), any(), any(), any(), any(), any(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(page);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.content[0].id").value("prod-1"));
    }

    @Test
    void getProductDetail_ShouldReturnProduct() throws Exception {
        ProductSummaryResponse product = ProductSummaryResponse.builder()
                .id("prod-1")
                .build();

        ProductDetailResponse productDetail = ProductDetailResponse.builder()
                .product(product)
                .build();
        
        when(productService.getProductDetail("prod-1")).thenReturn(productDetail);

        mockMvc.perform(get("/api/products/prod-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.product.id").value("prod-1"));
    }
}
