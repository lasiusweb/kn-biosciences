import { z } from 'zod';

export const CheckoutSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive()
  })).min(1),
  userId: z.string().uuid(),
  shippingAddress: z.object({
    firstname: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }),
  paymentMethod: z.enum(['easebuzz', 'payu'])
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
