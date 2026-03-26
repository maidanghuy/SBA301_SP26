import { z } from 'zod';

const preprocessNumber = (val: any) => {
  if (val === '' || val === null || val === undefined) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

export const productFilterSchema = z.object({
  keyword: z.string().optional().or(z.literal('')),
  brandId: z.preprocess(preprocessNumber, z.number().optional()),
  categoryId: z.preprocess(preprocessNumber, z.number().optional()),
  minPrice: z.preprocess(preprocessNumber, z.number().min(0).optional()),
  maxPrice: z.preprocess(preprocessNumber, z.number().min(0).optional()),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  minRating: z.preprocess(preprocessNumber, z.number().min(0).max(5).optional()),
  page: z.preprocess(preprocessNumber, z.number().int().min(0).optional()),
  size: z.preprocess(preprocessNumber, z.number().int().min(1).optional()),
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
}).refine((data) => {
  if (data.minPrice !== undefined && data.maxPrice !== undefined) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: "Min price must be less than or equal to max price",
  path: ["maxPrice"],
});

export type ProductFilterValues = z.infer<typeof productFilterSchema>;
