import authMiddleware from '@/authMiddleware';
import { db } from '@/db';
import { transactionsTable } from '@/db/schema';
import { createServerFn } from '@tanstack/react-start';
import { addDays } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const transactionSchema = z.object({
  id: z.number(),
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

export const updateTransaction = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof transactionSchema>) =>
    transactionSchema.parse(data)
  )
  .handler(async ({ context, data }) => {
    await db
      .update(transactionsTable)
      .set({
        amount: data.amount.toString(),
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: data.transactionDate,
      })
      .where(
        and(
          eq(transactionsTable.id, data.id),
          eq(transactionsTable.userId, context.userId)
        )
      );
  });
