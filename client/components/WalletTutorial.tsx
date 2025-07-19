import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

function WalletTutorial() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-sm underline">
          Wallet Help
        </button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Connecting Your Wallet</DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-2">
          <p>Install a compatible wallet extension like MetaMask.</p>
          <p>Unlock your wallet then click &quot;Connect Wallet&quot;.</p>
          <p>Approve the connection request in the wallet popup.</p>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WalletTutorial;
