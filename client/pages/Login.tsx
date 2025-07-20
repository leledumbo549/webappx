import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '@/atoms/loginAtoms';
import { loadWalletAtom } from '@/atoms/walletAtoms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2 } from 'lucide-react';
import WalletTutorial from '@/components/WalletTutorial';
import axios from '@/lib/axios';
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitNetworkCore,
  useAppKitProvider,
} from '@reown/appkit/react';
import { SiweMessage } from 'siwe';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { BrowserProvider, JsonRpcSigner, type Eip1193Provider } from 'ethers';

// Initialize AppKit once
// createAppKit({
//   projectId: '3dc8fb97b90a536ce400e5d65a3f5ff8',
//   networks: [mainnet],
//   defaultNetwork: mainnet,
// features: {
//   email: true, // default to true
//   socials: [
//     "google",
//     "x",
//     "github",
//     "discord",
//     "apple",
//     "facebook",
//     "farcaster",
//   ],
//   emailShowWallets: true, // default to true
// },
// })

const metadata = {
  name: "WebappX",
  description: "WebappX",
  url: "https://leledumbo549.github.io/webappx/",
  icons: ["https://leledumbo549.github.io/webappx/vite.svg"]
};


createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, arbitrum],
  metadata,
  projectId: '4c36910043a61e836e1f9fdeec53cba3',
  defaultAccountTypes: { eip155: 'eoa' },
  enableNetworkSwitch: false,
  features: {
    email: false,
    socials: ['google', 'facebook'],
    emailShowWallets: false, // default to true
  },
});

function Login() {
  const navigate = useNavigate();
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  const loadWallet = useSetAtom(loadWalletAtom);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<unknown>('eip155');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetworkCore();
  // const { walletProvider } = useAppKitProvider('eip155');

  const handleConnect = async () => {
    setError(null);
    setIsConnecting(true);
    try {
      await Promise.resolve(open());
    } catch (err) {
      let msg = err instanceof Error ? err.message : 'Wallet connection failed';
      
      // Handle COOP-specific errors
      if (msg.includes('Cross-Origin-Opener-Policy') || msg.includes('COOP')) {
        msg = 'Wallet popup blocked by browser security. Please allow popups for this site or try refreshing the page.';
      }
      
      setError(msg);
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignIn = async () => {
    if (!walletProvider || !address) return;
    setIsLoading(true);
    setError(null);

    try {
      const nonce = Math.random().toString(36).substring(2, 10);
      const cfg = {
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to MarketPlace',
        uri: window.location.origin,
        version: '1',
        chainId: chainId,
        nonce,
      };

      const msg = new SiweMessage(cfg as Partial<SiweMessage>);
      const message = msg.prepareMessage();
      const signerProvider = new BrowserProvider(
        walletProvider as unknown as Eip1193Provider,
        Number(chainId)
      );
      const signer = new JsonRpcSigner(signerProvider, address);
      const signature = await signer.signMessage(message);

      // const signature = await (
      //   walletProvider as unknown as {
      //     request: (args: {
      //       method: string
      //       params: unknown[]
      //     }) => Promise<string>
      //   }
      // ).request({
      //   method: 'personal_sign',
      //   params: [message, address],
      // })

      const res = await axios.post('/api/login/siwe', { message, signature });
      setToken(res.data.token);
      setUser(res.data.user);
      await loadWallet();
      navigate('/home', { replace: true });
    } catch (err) {
      console.log('!!!');
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Sign In with Ethereum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm">
            Wallet Status:{' '}
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isConnected ? (
            <div className="space-y-4">
              <Input readOnly value={address} />
              <Button
                className="w-full"
                onClick={handleSignIn}
                disabled={isLoading || isConnecting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                    in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
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
              <p className="text-xs text-muted-foreground text-center">
                If connection fails, try allowing popups or refresh the page
              </p>
            </div>
          )}
          <div className="text-center">
            <WalletTutorial />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
