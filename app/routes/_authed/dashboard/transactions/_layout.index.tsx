import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { AllTransactions } from './-all-transactions';
import { getTransactionYearRange } from '@/app/data/getTransactionYearsRange';
import { getTransactionsByMonth } from '@/app/data/getTransactionsByMonth';

const today = new Date();

const searchSchema = z.object({
  month: z
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1)
    .optional(),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/_layout/'
)({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => {
    const today = new Date();
    return {
      year: search.year ?? today.getFullYear(),
      month: search.month ?? today.getMonth() + 1,
    };
  },
  loader: async ({ deps }) => {
    const yearsRange = await getTransactionYearRange();
    const transactions = await getTransactionsByMonth({
      data: {
        month: deps.month,
        year: deps.year,
      },
    });

    return {
      transactions,
      year: deps.year,
      month: deps.month,
      yearsRange,
    };
  },
});

function RouteComponent() {
  const { year, month, yearsRange, transactions } = Route.useLoaderData();

  return (
    <AllTransactions
      transactions={transactions}
      year={year}
      month={month}
      yearsRange={yearsRange}
    />
  );
}
