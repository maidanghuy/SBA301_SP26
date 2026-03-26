package com.lacvn.service.impl;

import com.lacvn.common.PageResponse;
import com.lacvn.dto.request.ProductCreateRequest;
import com.lacvn.dto.request.ProductSearchRequest;
import com.lacvn.dto.request.ProductSpecificationKVRequest;
import com.lacvn.dto.request.ProductUpdateRequest;
import com.lacvn.dto.response.ProductDetailResponse;
import com.lacvn.dto.response.ProductFilterOptionResponse;
import com.lacvn.dto.response.ProductSpecificationResponse;
import com.lacvn.dto.response.ProductSummaryResponse;
import com.lacvn.dto.response.ProductSuggestionResponse;
import com.lacvn.dto.response.ReviewResponse;
import com.lacvn.entity.Brand;
import com.lacvn.entity.Category;
import com.lacvn.entity.Product;
import com.lacvn.entity.ProductSpecificationDefinition;
import com.lacvn.entity.ProductSpecification;
import com.lacvn.entity.Review;
import com.lacvn.exception.ResourceNotFoundException;
import com.lacvn.repository.BrandRepository;
import com.lacvn.repository.CategoryRepository;
import com.lacvn.repository.ProductRepository;
import com.lacvn.repository.ProductSpecificationRepository;
import com.lacvn.repository.ProductSpecificationDefinitionRepository;
import com.lacvn.repository.ReviewRepository;
import com.lacvn.service.ProductService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final ProductSpecificationDefinitionRepository productSpecificationDefinitionRepository;
    private final ReviewRepository reviewRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductDetailResponse createProduct(ProductCreateRequest request) {
        Product product = Product.builder()
                .id(UUID.randomUUID().toString())
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .image(request.getImage())
                .stock(request.getStock())
                .isNew(Boolean.TRUE.equals(request.getIsNew()))
                .isFeatured(Boolean.TRUE.equals(request.getIsFeatured()))
                .rating(BigDecimal.ZERO)
                .reviewsCount(0)
                .brand(getBrandOrNull(request.getBrandId()))
                .category(getCategoryOrNull(request.getCategoryId()))
                .build();

        Product saved = productRepository.save(product);
        saveSpecifications(saved, request.getSpecifications());

        // Return product detail including technical specifications (reviews will be empty at create time).
        return ProductDetailResponse.builder()
                .product(toSummary(saved))
                .specifications(getProductSpecifications(saved.getId()))
                .reviews(List.of())
                .build();
    }

    @Override
    public ProductDetailResponse updateProduct(String id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (Boolean.TRUE.equals(product.getDeleteFlag())) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }

        if (request.getName() != null) product.setName(request.getName());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getImage() != null) product.setImage(request.getImage());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getIsNew() != null) product.setIsNew(request.getIsNew());
        if (request.getIsFeatured() != null) product.setIsFeatured(request.getIsFeatured());
        if (request.getBrandId() != null) product.setBrand(getBrandOrNull(request.getBrandId()));
        if (request.getCategoryId() != null) product.setCategory(getCategoryOrNull(request.getCategoryId()));

        Product saved = productRepository.save(product);

        // Update specifications if provided
        if (request.getSpecifications() != null) {
            // Delete old specifications
            List<ProductSpecification> oldSpecs = productSpecificationRepository.findByProductId(saved.getId());
            if (!oldSpecs.isEmpty()) {
                productSpecificationRepository.deleteAll(oldSpecs);
            }
            // Save new specifications
            saveSpecifications(saved, request.getSpecifications());
        }

        // Return product detail including technical specifications.
        return ProductDetailResponse.builder()
                .product(toSummary(saved))
                .specifications(getProductSpecifications(saved.getId()))
                .reviews(getProductReviews(saved.getId()))
                .build();
    }

    @Override
    public ProductDetailResponse deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Build response before soft delete so the helper methods still see active product.
        ProductDetailResponse detailBeforeDelete = ProductDetailResponse.builder()
                .product(toSummary(product))
                .specifications(getProductSpecifications(product.getId()))
                .reviews(getProductReviews(product.getId()))
                .build();

        product.setDeleteFlag(true);
        productRepository.save(product);

        return detailBeforeDelete;
    }

    @Override
    public PageResponse<ProductSummaryResponse> getProducts(
            String keyword,
            Long brandId,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean isNew,
            Boolean isFeatured,
            BigDecimal minRating,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String normalizedSortBy = normalizeSortBy(sortBy);
        PageRequest pageable = PageRequest.of(page, size, Sort.by(direction, normalizedSortBy));

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isFalse(root.get("deleteFlag")));

            if (keyword != null && !keyword.isBlank()) {
                String likePattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), likePattern),
                        cb.like(cb.lower(root.get("description")), likePattern)
                ));
            }
            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (isNew != null) {
                predicates.add(cb.equal(root.get("isNew"), isNew));
            }
            if (isFeatured != null) {
                predicates.add(cb.equal(root.get("isFeatured"), isFeatured));
            }
            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> result = productRepository.findAll(spec, pageable);
        return PageResponse.<ProductSummaryResponse>builder()
                .content(result.getContent().stream().map(this::toSummary).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .hasNext(result.hasNext())
                .build();
    }

    @Override
    public ProductDetailResponse getProductDetail(String id) {
        Product product = productRepository.findById(id)
                .filter(p -> !Boolean.TRUE.equals(p.getDeleteFlag()))
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        return ProductDetailResponse.builder()
                .product(toSummary(product))
                .specifications(getProductSpecifications(id))
                .reviews(getProductReviews(id))
                .build();
    }

    @Override
    public List<ProductSpecificationResponse> getProductSpecifications(String id) {
        ensureProductExists(id);
        List<ProductSpecification> specifications = productSpecificationRepository.findByProductId(id);
        return specifications.stream()
                .map(spec -> ProductSpecificationResponse.builder()
                        .id(spec.getId())
                        .specKey(spec.getSpecification().getKey())
                        .specNameVi(spec.getSpecification().getNameVi())
                        .specValue(spec.getValue())
                        .build())
                .toList();
    }

    private void saveSpecifications(Product product, List<ProductSpecificationKVRequest> kvRequests) {
        if (kvRequests == null || kvRequests.isEmpty()) return;

        long nextId = productSpecificationRepository.findTopByOrderByIdDesc()
                .map(ProductSpecification::getId)
                .orElse(0L) + 1L;

        List<ProductSpecification> toSave = new java.util.ArrayList<>();
        java.util.Set<String> seenKeys = new java.util.HashSet<>();

        for (ProductSpecificationKVRequest kv : kvRequests) {
            if (kv == null || kv.getKey() == null) continue;
            if (!seenKeys.add(kv.getKey())) continue; // avoid duplicate spec keys in request

            ProductSpecificationDefinition definition = productSpecificationDefinitionRepository.findByKey(kv.getKey())
                    .orElseThrow(() -> new IllegalArgumentException("Specification key not found: " + kv.getKey()));

            toSave.add(ProductSpecification.builder()
                    .id(nextId++)
                    .product(product)
                    .specification(definition)
                    .value(kv.getValue())
                    .build());
        }

        if (!toSave.isEmpty()) {
            productSpecificationRepository.saveAll(toSave);
        }
    }

    @Override
    public List<ReviewResponse> getProductReviews(String id) {
        ensureProductExists(id);
        List<Review> reviews = reviewRepository.findByProductId(id);
        return reviews.stream()
                .map(review -> ReviewResponse.builder()
                        .id(review.getId())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .userId(review.getUser() != null ? review.getUser().getId() : null)
                        .userFullName(review.getUser() != null ? review.getUser().getFullName() : null)
                        .createdAt(review.getCreatedAt())
                        .build())
                .toList();
    }

    @Override
    public List<ProductSummaryResponse> getFeaturedProducts(int limit) {
        return getProducts(null, null, null, null, null, null, true, null, 0, limit, "createdAt", "desc")
                .getContent();
    }

//    @Override
//    public List<ProductSummaryResponse> getNewestProducts(int limit) {
//        return getProducts(null, null, null, null, null, true, null, null, 0, limit, "createdAt", "desc")
//                .getContent();
//    }

    @Override
    public List<ProductSummaryResponse> getProductsByCategory(Long categoryId) {
        List<Product> products = productRepository.findByCategoryIdAndDeleteFlagFalse(categoryId);
        return products.stream().map(this::toSummary).toList();
    }

    @Override
    public PageResponse<ProductSummaryResponse> searchProducts(ProductSearchRequest request) {
        request = request.withDefaults();
        return getProducts(
                request.getKeyword(),
                request.getBrandId(),
                request.getCategoryId(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getIsNew(),
                request.getIsFeatured(),
                request.getMinRating(),
                request.getPage(),
                request.getSize(),
                request.getSortBy(),
                request.getSortDir()
        );
    }

    @Override
    public ProductFilterOptionResponse getFilterOptions() {
        // Get all brands with product count
        List<Brand> allBrands = brandRepository.findAll();
        List<ProductFilterOptionResponse.BrandOptionResponse> brandOptions = allBrands.stream()
                .map(brand -> ProductFilterOptionResponse.BrandOptionResponse.builder()
                        .id(brand.getId())
                        .name(brand.getName())
                        .productCount(productRepository.countByBrandId(brand.getId()))
                        .build())
                .filter(b -> b.getProductCount() > 0)
                .toList();

        // Get all categories with product count
        List<Category> allCategories = categoryRepository.findAll();
        List<ProductFilterOptionResponse.CategoryOptionResponse> categoryOptions = allCategories.stream()
                .map(category -> ProductFilterOptionResponse.CategoryOptionResponse.builder()
                        .id(category.getId())
                        .nameVn(category.getNameVn())
                        .nameEnglish(category.getNameEnglish())
                        .productCount(productRepository.countByCategoryId(category.getId()))
                        .build())
                .filter(c -> c.getProductCount() > 0)
                .toList();

        // Get min/max price
        BigDecimal minPrice = productRepository.getMinPrice();
        BigDecimal maxPrice = productRepository.getMaxPrice();

        return ProductFilterOptionResponse.builder()
                .minPrice(minPrice != null ? minPrice : BigDecimal.ZERO)
                .maxPrice(maxPrice != null ? maxPrice : BigDecimal.ZERO)
                .minRating(0)
                .maxRating(5)
                .brands(brandOptions)
                .categories(categoryOptions)
                .build();
    }

    @Override
    public List<ProductSummaryResponse> getProductSuggestions(String keyword,
                                                              int limit,
                                                              Long brandId,
                                                              Long categoryId,
                                                              BigDecimal minPrice,
                                                              BigDecimal maxPrice,
                                                              Boolean isNew,
                                                              Boolean isFeatured,
                                                              BigDecimal minRating) {
        if (keyword == null || keyword.isBlank()) {
            return List.of();
        }

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isFalse(root.get("deleteFlag")));

            String likePattern = "%" + keyword.trim().toLowerCase() + "%";
            predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("description")), likePattern)
            ));

            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (isNew != null) {
                predicates.add(cb.equal(root.get("isNew"), isNew));
            }
            if (isFeatured != null) {
                predicates.add(cb.equal(root.get("isFeatured"), isFeatured));
            }
            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Product> results = productRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .limit(limit)
                .toList();

        return results.stream().map(this::toSummary).toList();
    }

    private void ensureProductExists(String id) {
        productRepository.findById(id)
                .filter(p -> !Boolean.TRUE.equals(p.getDeleteFlag()))
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private Brand getBrandOrNull(Long brandId) {
        if (brandId == null) return null;
        return brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + brandId));
    }

    private Category getCategoryOrNull(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private String normalizeSortBy(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) return "createdAt";
        return switch (sortBy) {
            case "name", "price", "rating", "reviewsCount", "createdAt" -> sortBy;
            default -> "createdAt";
        };
    }

    private ProductSummaryResponse toSummary(Product product) {
        return ProductSummaryResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .image(product.getImage())
                .stock(product.getStock())
                .isNew(product.getIsNew())
                .isFeatured(product.getIsFeatured())
                .rating(product.getRating())
                .reviewsCount(product.getReviewsCount())
                .brandId(product.getBrand() != null ? product.getBrand().getId() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getNameVn() : null)
                .build();
    }
}
