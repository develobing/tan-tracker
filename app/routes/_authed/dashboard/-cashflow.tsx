import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import numeral from 'numeral';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

export function Cashflow({
  year,
  annualCashflow,
  yearsRange,
}: {
  year: number;
  annualCashflow: {
    year: number;
    month: number;
    income: number;
    expense: number;
  }[];
  yearsRange: number[];
}) {
  const navigate = useNavigate();
  const totalIncome = annualCashflow.reduce(
    (acc, curr) => acc + curr.income,
    0
  );
  const totalExpense = annualCashflow.reduce(
    (acc, curr) => acc + curr.expense,
    0
  );
  const balance = totalIncome - totalExpense;

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>

          <div>
            <Select
              defaultValue={year.toString()}
              onValueChange={(value) => {
                navigate({
                  to: '/dashboard',
                  search: {
                    cfyear: Number(value),
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>

              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-[1fr_175px]">
        <ChartContainer
          className="w-full h-[300px]"
          config={{
            income: {
              label: 'Income',
              color: '#84cc16',
            },
            expense: {
              label: 'Expense',
              color: '#f97316',
            },
          }}
        >
          <BarChart data={annualCashflow}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(value) => {
                return `$${numeral(value).format('0,0')}`;
              }}
            />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => {
                return format(new Date(year, value - 1), 'MMM');
              }}
            />
            <Legend align="right" verticalAlign="top" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    return (
                      <div>
                        {format(
                          new Date(year, payload[0]?.payload?.month - 1, 1),
                          'MMM'
                        )}
                      </div>
                    );
                  }}
                />
              }
            />

            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>

        <div className="border-l px-4 flex flex-col gap-6 justify-center">
          <div className="flex flex-col gap-1">
            <div className="text-xl text-muted-foreground">Income</div>
            <span className="text-3xl font-semibold text-foreground">
              {numeral(totalIncome).format('$0,0')}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-xl text-muted-foreground">Expense</div>
            <span className="text-3xl font-semibold text-foreground">
              {numeral(totalExpense).format('$0,0')}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-xl text-muted-foreground">Balance</div>
            <span
              className={`text-3xl font-semibold ${
                balance >= 0 ? 'text-green-500' : 'text-orange-500'
              }`}
            >
              {numeral(balance).format('$0,0')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
