import { createFileRoute } from '@tanstack/react-router';
import { RecentTransactions } from './-recent-transcation';
import { getRecentTransactions } from '@/app/data/getRecentTransactions';
import { getAnnualCashflow } from '@/app/data/getAnnualCashflow';
import { getTransactionYearRange } from '@/app/data/getTransactionYearsRange';
import { Cashflow } from './-cashflow';
import { z } from 'zod';

const today = new Date();
const searchSchema = z.object({
  cfyear: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute('/_authed/dashboard/')({
  validateSearch: searchSchema,
  beforeLoad: ({ context }) => {
    context.userId;
  },
  component: RouteComponent,
  loaderDeps: ({ search }) => ({
    cfyear: search.cfyear ?? today.getFullYear(),
  }),
  loader: async ({ deps }) => {
    const [transactions, cashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({
        data: {
          year: deps.cfyear,
        },
      }),
      getTransactionYearRange(),
    ]);

    return {
      cfyear: deps.cfyear,
      cashflow,
      transactions,
      yearsRange,
    };
  },
});

function RouteComponent() {
  const { cfyear, transactions, cashflow, yearsRange } = Route.useLoaderData();

  return (
    <div className="max-w-screen-xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>

      <Cashflow
        year={cfyear}
        annualCashflow={cashflow}
        yearsRange={yearsRange}
      />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
