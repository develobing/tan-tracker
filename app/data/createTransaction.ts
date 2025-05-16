import authMiddleware from '@/authMiddleware';
import { db } from '@/db';
import { transactionsTable } from '@/db/schema';
import { createServerFn } from '@tanstack/react-start';
import { addDays } from 'date-fns';
import { z } from 'zod';

const transactionFormSchema = z.object({
  transactionType: z.enum(['income', 'expense']),
  categoryId: z.coerce.number().positive('Please select a category'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters long')
    .max(300, 'Description must be at most 300 characters long'),
  transactionDate: z.string().refine((value) => {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate.getTime()) && parsedDate <= addDays(new Date(), 1);
  }),
});

export const createTransaction = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof transactionFormSchema>) =>
    transactionFormSchema.parse(data)
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const transaction = await db
      .insert(transactionsTable)
      .values({
        userId,
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .returning();

    return transaction;
  });
