package com.lacvn.dto.response;

import com.lacvn.common.PageResponse;
import lombok.Builder;
import lombok.Data;

/**
 * Wrapper response for product search with filter options
 */
@Data
@Builder
public class ProductSearchResultResponse {
    private PageResponse<ProductSummaryResponse> products;
    private ProductFilterOptionResponse filters;
}
