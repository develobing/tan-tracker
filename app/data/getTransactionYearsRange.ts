import authMiddleware from '@/authMiddleware';
import { db } from '@/db';
import { transactionTable } from '@/db/schema';
import { createServerFn } from '@tanstack/react-start';
import { asc, eq } from 'drizzle-orm';

export const getTransactionYearRange = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const today = new Date();
    const [earliestTransaction] = await db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.userId, context.userId))
      .orderBy(asc(transactionTable.transactionDate))
      .limit(1);

    const currentYear = today.getFullYear();
    const earliestYear = earliestTransaction
      ? new Date(earliestTransaction.transactionDate).getFullYear()
      : currentYear;

    const years = Array.from(
      { length: currentYear - earliestYear + 1 },
      (_, i) => earliestYear + i
    );

    return years;
  });
