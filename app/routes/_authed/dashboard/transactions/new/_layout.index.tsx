import { createTransaction } from '@/app/data/createTransaction';
import { getCategories } from '@/app/data/getCategories';
import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { z } from 'zod';

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/new/_layout/'
)({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();

    return {
      categories,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { categories } = Route.useLoaderData();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const transaction = await createTransaction({
      data: {
        amount: data.amount,
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
        transactionType: data.transactionType,
      },
    });

    toast('Transaction created successfully', {
      description: `Transaction ${transaction[0].description} created successfully`,
      duration: 2000,
    });
    navigate({
      to: '/dashboard/transactions',
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>

      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
