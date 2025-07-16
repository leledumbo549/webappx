import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom } from '@/atoms/loginAtoms'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import axios from '@/lib/axios'
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
} from '@reown/appkit/react'
import { mainnet } from 'viem/chains'
import { SiweMessage } from 'siwe'

// Initialize AppKit once
createAppKit({
  projectId: 'demo',
  networks: [mainnet],
  defaultNetwork: mainnet,
})

function LoginSIWE() {
  const navigate = useNavigate()
  const [, setToken] = useAtom(tokenAtom)
  const [, setUser] = useAtom(userAtom)
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount({ namespace: 'eip155' })
  const { walletProvider } = useAppKitProvider<unknown>('eip155')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = () => {
    open()
  }

  const handleSignIn = async () => {
    if (!walletProvider || !address) return
    setIsLoading(true)
    setError(null)
    try {
      const nonce = Math.random().toString(36).substring(2, 10)
      const siwe = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to MarketPlace',
        uri: window.location.origin,
        version: '1',
        chainId: 1,
        nonce,
      })
      const message = siwe.prepareMessage()
      const signature = await (
        walletProvider as unknown as {
          request: (args: {
            method: string
            params: unknown[]
          }) => Promise<string>
        }
      ).request({
        method: 'personal_sign',
        params: [message, address],
      })
      const res = await axios.post('/api/login/siwe', { message, signature })
      setToken(res.data.token)
      setUser(res.data.user)
      navigate('/home', { replace: true })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Sign In with Ethereum
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                disabled={isLoading}
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
            <Button
              className="w-full"
              onClick={handleConnect}
              disabled={isLoading}
            >
              Connect Wallet
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginSIWE
