import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Moon, Sun, Palette, User, Shield, Bell, Globe, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const moodThemes = [
  { id: 'balanced', name: 'Balanced', color: 'hsl(243 75% 59%)', description: 'Healthy spending habits' },
  { id: 'saving', name: 'Saving Mode', color: 'hsl(142 76% 36%)', description: 'Under budget goals' },
  { id: 'warning', name: 'Caution', color: 'hsl(38 92% 50%)', description: 'Approaching limits' },
  { id: 'alert', name: 'Alert', color: 'hsl(0 84% 60%)', description: 'Over budget' },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
];

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [selectedMood, setSelectedMood] = useState('balanced');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        toast({
          title: 'Profile picture updated',
          description: 'Your profile picture has been successfully updated.',
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please select a valid image file.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowWebcam(true);
      }
    } catch (error) {
      toast({
        title: 'Camera access denied',
        description: 'Please allow camera access to capture a photo.',
        variant: 'destructive',
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setProfileImage(canvas.toDataURL('image/png'));
        stopWebcam();
        toast({
          title: 'Photo captured',
          description: 'Your profile picture has been updated.',
        });
      }
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setShowWebcam(false);
    }
  };

  const removeProfilePicture = () => {
    setProfileImage('');
    toast({
      title: 'Profile picture removed',
      description: 'Your profile picture has been removed.',
    });
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as 'light' | 'dark' | 'system');
    toast({
      title: 'Theme updated',
      description: `Theme changed to ${newTheme} mode.`,
    });
  };

  const handleMoodThemeChange = (moodId: string) => {
    setSelectedMood(moodId);
    toast({
      title: 'Mood theme updated',
      description: `Dashboard theme set to ${moodThemes.find(m => m.id === moodId)?.name}.`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Customization</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile, preferences, and security settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Picture Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload, capture, or remove your profile picture with drag-and-drop support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div
                className={cn(
                  "relative group cursor-pointer transition-all duration-300",
                  isHovering && "scale-105",
                  isDragging && "scale-110 ring-4 ring-primary"
                )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-32 w-32 border-4 border-border shadow-lg">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback className="text-4xl">JD</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  isDragging && "opacity-100"
                )}>
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>

                  <Dialog open={showWebcam} onOpenChange={setShowWebcam}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={startWebcam} className="gap-2">
                        <Camera className="h-4 w-4" />
                        Capture Photo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Capture Photo</DialogTitle>
                        <DialogDescription>
                          Position yourself and click capture when ready
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          className="w-full rounded-lg border"
                        />
                        <div className="flex gap-2">
                          <Button onClick={capturePhoto} className="flex-1">
                            <Camera className="h-4 w-4 mr-2" />
                            Capture
                          </Button>
                          <Button variant="outline" onClick={stopWebcam}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {profileImage && (
                    <Button
                      variant="destructive"
                      onClick={removeProfilePicture}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Drag and drop an image, upload from your device, or capture using your webcam
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Customization
            </CardTitle>
            <CardDescription>
              Customize your visual experience with smooth transitions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Color Theme</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('light')}
                  className="flex-1 gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('dark')}
                  className="flex-1 gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Mood-Based Dashboard Theme
              </Label>
              <p className="text-sm text-muted-foreground">
                Dashboard theme reflects your spending habits
              </p>
              <div className="grid grid-cols-2 gap-2">
                {moodThemes.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodThemeChange(mood.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all duration-300 text-left hover:scale-105",
                      selectedMood === mood.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: mood.color }}
                      />
                      <span className="font-medium text-sm">{mood.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{mood.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Currency & Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Currency & Integrations
            </CardTitle>
            <CardDescription>
              Multi-currency support with real-time conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="currency">Primary Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Connected Services</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">Bank Account</p>
                    <p className="text-xs text-muted-foreground">Automatic transaction sync</p>
                  </div>
                  <Badge variant="outline">Not Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">Cryptocurrency</p>
                    <p className="text-xs text-muted-foreground">Portfolio tracking</p>
                  </div>
                  <Badge variant="outline">Not Connected</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              AES-256 encryption and two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch
                id="2fa"
                checked={twoFactorEnabled}
                onCheckedChange={(checked) => {
                  setTwoFactorEnabled(checked);
                  toast({
                    title: checked ? '2FA Enabled' : '2FA Disabled',
                    description: checked
                      ? 'Two-factor authentication has been enabled.'
                      : 'Two-factor authentication has been disabled.',
                  });
                }}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Data Encryption</Label>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">AES-256 Encryption Active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All sensitive data is encrypted with military-grade security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage email and push notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notif">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notif">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive alerts on mobile and web</p>
              </div>
              <Switch
                id="push-notif"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Notification Types</Label>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="fraud" defaultChecked className="rounded" />
                  <label htmlFor="fraud">Fraud alerts</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="budget" defaultChecked className="rounded" />
                  <label htmlFor="budget">Budget warnings</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="goals" defaultChecked className="rounded" />
                  <label htmlFor="goals">Goal achievements</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="insights" defaultChecked className="rounded" />
                  <label htmlFor="insights">AI insights</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                  <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                  <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                  <SelectItem value="ist">India Standard Time (GMT+5:30)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={() => {
              toast({
                title: 'Profile updated',
                description: 'Your profile information has been saved successfully.',
              });
            }}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}