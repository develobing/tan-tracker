import { deleteTransaction } from '@/app/data/deleteTransaction';
import { getCategories } from '@/app/data/getCategories';
import { getTransaction } from '@/app/data/getTransaction';
import { updateTransaction } from '@/app/data/updateTransaction';
import TransactionForm, {
  transactionFormSchema,
} from '@/components/transaction-form';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export const Route = createFileRoute(
  '/_authed/dashboard/transactions/$transactionId/_layout/'
)({
  component: RouteComponent,
  errorComponent: () => (
    <div className="py-5 text-3xl text-muted-foreground">
      Oops! Transaction not found
    </div>
  ),
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: { transactionId: Number(params.transactionId) },
      }),
    ]);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      categories,
      transaction,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { categories, transaction } = Route.useLoaderData();
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
        categoryId: data.categoryId,
        description: data.description,
        transactionType: data.transactionType,
      },
    });

    toast('Transaction updated successfully', {
      description: `Transaction ${transaction.description} updated successfully`,
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

  const handleDeleteConfirm = async () => {
    setDeleting(true);

    await deleteTransaction({
      data: { transactionId: transaction.id },
    });

    toast('Transaction deleted successfully', {
      description: `Transaction ${transaction.description} deleted successfully`,
      duration: 2000,
    });

    setDeleting(false);

    navigate({
      to: '/dashboard/transactions',
      search: {
        month: Number(transaction.transactionDate.split('-')[1]),
        year: Number(transaction.transactionDate.split('-')[0]),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this transaction?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  transaction from your account.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  disabled={deleting}
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <TransactionForm
          defaultValues={{
            amount: Number(transaction.amount),
            description: transaction.description,
            categoryId: transaction.categoryId,
            transactionDate: new Date(transaction.transactionDate),
            transactionType:
              categories.find((cat) => cat.id === transaction.categoryId)
                ?.type || 'income',
          }}
          categories={categories}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
}
