import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '@/atoms/loginAtoms';
import { loadWalletAtom } from '@/atoms/walletAtoms';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import axios from '@/lib/axios';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitNetworkCore,
  useAppKitProvider,
} from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { BrowserProvider, JsonRpcSigner, type Eip1193Provider } from 'ethers';
import { SiweMessage } from 'siwe';
import { Store, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import WalletTutorial from '@/components/WalletTutorial';

createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, arbitrum],
  projectId: '3dc8fb97b90a536ce400e5d65a3f5ff8',
  defaultAccountTypes: { eip155: 'eoa' },
  enableNetworkSwitch: false,
  features: {
    email: false,
    socials: ['google', 'facebook'],
    emailShowWallets: false,
  },
});

function Register() {
  const navigate = useNavigate();
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  const loadWallet = useSetAtom(loadWalletAtom);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<unknown>('eip155');
  const { chainId } = useAppKitNetworkCore();
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);
    try {
      await Promise.resolve(open());
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Wallet connection failed';
      setError(msg);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!walletProvider || !address) {
      await handleConnect();
      if (!walletProvider || !address) return;
    }
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      const msg = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to MarketPlace',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      } as Partial<SiweMessage>);
      const message = msg.prepareMessage();
      const signerProvider = new BrowserProvider(
        walletProvider as unknown as Eip1193Provider,
        Number(chainId)
      );
      const signer = new JsonRpcSigner(signerProvider, address);
      const signature = await signer.signMessage(message);
      const res = await axios.post('/api/login/siwe', { message, signature });
      setToken(res.data.token);
      setUser(res.data.user);

      const profile: Record<string, unknown> = {
        name: formData.get('name'),
        username: formData.get('username'),
        role,
      };
      await axios.put('/api/me', profile, {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      if (role === 'seller') {
        await axios.put(
          '/api/seller/profile',
          {
            name: formData.get('storeName'),
            contact: formData.get('contact'),
            bio: formData.get('bio'),
          },
          { headers: { Authorization: `Bearer ${res.data.token}` } }
        );
      }

      await loadWallet();
      setSuccess(true);
      setTimeout(() => navigate('/home', { replace: true }), 500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-2xl">MarketPlace</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Create an account
          </h2>
        </div>
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input id="name" name="name" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(val) => setRole(val as 'buyer' | 'seller')}
                  className="flex gap-4"
                >
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="buyer" /> Buyer
                  </Label>
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="seller" /> Seller
                  </Label>
                </RadioGroup>
              </div>
              {role === 'seller' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-sm font-medium">
                      Store Name
                    </Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-sm font-medium">
                      Contact
                    </Label>
                    <Input id="contact" name="contact" disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Account created, redirecting...
                  </AlertDescription>
                </Alert>
              )}
              {isConnected ? (
                <div className="space-y-4">
                  <Input readOnly value={address} />
                  <Button
                    type="submit"
                    className="w-full h-10"
                    disabled={isLoading || isConnecting}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleConnect}
                  disabled={isConnecting || isLoading}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                      Connecting...
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </Button>
              )}
              <div className="text-center">
                <WalletTutorial />
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <button
            type="button"
            className="underline"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
