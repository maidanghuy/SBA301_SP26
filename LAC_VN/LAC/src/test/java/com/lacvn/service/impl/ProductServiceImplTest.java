package com.lacvn.service.impl;

import com.lacvn.common.PageResponse;
import com.lacvn.dto.response.ProductDetailResponse;
import com.lacvn.dto.response.ProductSummaryResponse;
import com.lacvn.entity.Product;
import com.lacvn.exception.ResourceNotFoundException;
import com.lacvn.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductSpecificationRepository productSpecificationRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void getProductDetail_ShouldReturnDetail_WhenProductExists() {
        Product product = new Product();
        product.setId("prod-1");
        product.setName("Laptop");
        product.setPrice(new BigDecimal("1000"));
        product.setDeleteFlag(false);

        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product));
        when(productSpecificationRepository.findByProductId("prod-1")).thenReturn(Collections.emptyList());
        when(reviewRepository.findByProductId("prod-1")).thenReturn(Collections.emptyList());

        ProductDetailResponse result = productService.getProductDetail("prod-1");

        assertNotNull(result);
        assertEquals("Laptop", result.getProduct().getName());
    }

    @Test
    void getProductDetail_ShouldThrowException_WhenProductNotFound() {
        when(productRepository.findById("invalid")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductDetail("invalid"));
    }

    @Test
    void getProducts_ShouldReturnPageResponse() {
        Product product = new Product();
        product.setId("prod-1");
        product.setName("Laptop");
        product.setDeleteFlag(false);

        Page<Product> productPage = new PageImpl<>(Collections.singletonList(product));

        when(productRepository.findAll(any(Specification.class), any(PageRequest.class)))
                .thenReturn(productPage);

        PageResponse<ProductSummaryResponse> result = productService.getProducts(
                null, null, null, null, null, null, null, null, 0, 10, "createdAt", "desc"
        );

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Laptop", result.getContent().get(0).getName());
    }
}
