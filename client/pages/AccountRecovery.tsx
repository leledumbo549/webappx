import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/loginAtoms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function AccountRecovery() {
  const [user] = useAtom(userAtom);
  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Account Recovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            If you lost access to your wallet, contact our support team to
            verify your identity and update your address.
          </p>
          <div className="space-y-2">
            <Label>Registered Address</Label>
            <Input readOnly value={user?.ethereumAddress || ''} />
          </div>
          <Button asChild>
            <a href="mailto:support@example.com">Contact Support</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AccountRecovery;
