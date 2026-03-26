import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  price: z.number().min(0.01, 'Price must be at least 0.01'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional().or(z.literal('')),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  stock: z.number().int().min(0, 'Stock must be at least 0'),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  brandId: z.number().int().positive('Brand is required'),
  categoryId: z.number().int().positive('Category is required'),
  specifications: z.array(z.object({
    key: z.string().min(1, 'Key is required'),
    value: z.string().min(1, 'Value is required'),
  })),
});

export type ProductFormValues = z.infer<typeof productSchema>;
