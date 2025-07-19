import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { AdminSettings } from '@/types/Admin'
import { Settings, Save, AlertCircle, Loader2 } from 'lucide-react'

function SiteSettings() {
  const [data, setData] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get<AdminSettings>('/api/admin/settings')
      setData(res.data)
    } catch (err) {
      console.error('Failed to load settings:', err)
      setError('Failed to load settings. Please try again.')
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return

    setSaving(true)
    setError(null)

    try {
      const res = await axios.put<AdminSettings>('/api/admin/settings', data)
      setData(res.data)
      toast.success('Settings saved successfully!')
    } catch (err) {
      console.error('Failed to save settings:', err)
      setError('Failed to save settings. Please try again.')
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No settings data available</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Configure global marketplace settings and preferences
        </p>
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fees" className="text-sm font-medium">
                  Marketplace Fee (%)
                </Label>
                <Input
                  id="fees"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={data.fees || ''}
                  onChange={(e) =>
                    setData({ ...data, fees: Number(e.target.value) })
                  }
                  placeholder="Enter fee percentage"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Percentage fee charged on each transaction
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payout" className="text-sm font-medium">
                  Payout Delay (days)
                </Label>
                <Input
                  id="payout"
                  type="number"
                  min="0"
                  max="365"
                  value={data.payoutDelay || ''}
                  onChange={(e) =>
                    setData({ ...data, payoutDelay: Number(e.target.value) })
                  }
                  placeholder="Enter delay in days"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Number of days before sellers receive payouts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={saving || loading}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>

              {saving && (
                <p className="text-sm text-muted-foreground">
                  Updating settings...
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SiteSettings
