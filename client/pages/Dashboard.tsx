import { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import axios from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { StabletokenTransaction } from '@/types/Transaction';
import {
  stabletokenBalanceAtom,
  transactionsAtom,
  refreshBalanceAtom,
  refreshTransactionsAtom,
} from '@/atoms/stabletokenAtoms';

function Dashboard() {
  const [amount, setAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [pending, setPending] = useState<{ id: string; amount: number }[]>([]);

  const [balance] = useAtom(stabletokenBalanceAtom);
  const transactions = useAtomValue(transactionsAtom);
  const refreshBalance = useSetAtom(refreshBalanceAtom);
  const refreshTransactions = useSetAtom(refreshTransactionsAtom);

  useEffect(() => {
    refreshBalance();
    refreshTransactions();
  }, [refreshBalance, refreshTransactions]);

  useEffect(() => {
    if (!pending.length) return;
    const interval = setInterval(() => {
      refreshTransactions();
      refreshBalance();
    }, 3000);
    return () => clearInterval(interval);
  }, [pending, refreshTransactions, refreshBalance]);

  useEffect(() => {
    if (!pending.length) return;
    setPending((p) =>
      p.filter((pp) => !transactions.find((t) => t.reference === pp.id))
    );
  }, [transactions, pending]);

  const handleMint = async () => {
    try {
      await axios.post('/api/mint', { amount: Number(amount) });
      setAmount('');
      refreshBalance();
      refreshTransactions();
    } catch (err) {
      console.error('Mint failed:', err);
    }
  };

  const handleFiatMint = async () => {
    try {
      const res = await axios.post('/api/payments/initiate', {
        amount: Number(fiatAmount),
      });
      window.open(res.data.paymentUrl, '_blank');
      setPending((p) => [
        ...p,
        { id: res.data.paymentId, amount: Number(fiatAmount) },
      ]);
      setFiatAmount('');
    } catch (err) {
      console.error('Payment initiate failed:', err);
    }
  };

  interface TxRow extends StabletokenTransaction {
    status?: string;
  }

  const columns: ColumnDef<TxRow>[] = [
    { accessorKey: 'id', header: 'ID', meta: { widthClass: 'w-24' } },
    { accessorKey: 'type', header: 'Type', meta: { widthClass: 'w-28' } },
    { accessorKey: 'amount', header: 'Amount', meta: { widthClass: 'w-28' } },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { widthClass: 'w-28' },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      meta: { widthClass: 'w-36' },
    },
  ];

  const tableData: TxRow[] = [
    ...pending.map((p, idx) => ({
      id: -1 - idx,
      userId: 0,
      amount: p.amount,
      type: 'payment',
      reference: p.id,
      createdAt: new Date().toISOString(),
      status: 'pending',
    })),
    ...transactions.map((t) => ({ ...t, status: 'completed' })),
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Stabletoken Balance</h2>
        <div className="text-2xl font-bold">{balance}</div>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <Button onClick={handleMint}>Mint</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Mint Stabletoken (Pay by Fiat)
        </h3>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={fiatAmount}
            onChange={(e) => setFiatAmount(e.target.value)}
            placeholder="Amount"
          />
          <Button onClick={handleFiatMint}>Pay</Button>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        <DataTable columns={columns} data={tableData} isLoading={false} />
      </div>
    </div>
  );
}

export default Dashboard;
