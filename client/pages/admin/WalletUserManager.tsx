import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { DataTable } from '@/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import type { Wallet, PublicUser } from '@/server/schema';

interface WalletRow extends Wallet {
  username: string;
  ethereumAddress: string;
}

function WalletUserManager() {
  const [data, setData] = useState<WalletRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [walletRes, userRes] = await Promise.all([
      axios.get<Wallet[]>('/api/admin/wallets'),
      axios.get<PublicUser[]>('/api/admin/users'),
    ]);
    const userMap = new Map(userRes.data.map((u) => [u.id, u]));
    setData(
      walletRes.data.map((w) => ({
        ...w,
        username: userMap.get(w.userId)?.username || '',
        ethereumAddress: userMap.get(w.userId)?.ethereumAddress || '',
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnDef<WalletRow>[] = [
    { accessorKey: 'userId', header: 'User ID', meta: { widthClass: 'w-16' } },
    {
      accessorKey: 'username',
      header: 'Username',
      meta: { widthClass: 'w-32', cellClass: 'truncate' },
    },
    {
      accessorKey: 'ethereumAddress',
      header: 'Address',
      meta: { widthClass: 'w-64', cellClass: 'truncate' },
    },
    { accessorKey: 'balance', header: 'Balance', meta: { widthClass: 'w-24' } },
  ];

  return <DataTable columns={columns} data={data} isLoading={loading} />;
}

export default WalletUserManager;
