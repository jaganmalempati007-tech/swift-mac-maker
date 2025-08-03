import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calculator as CalcIcon, FileText, Timer as TimerIcon, Download } from 'lucide-react';
import Calculator from '@/components/Calculator';
import Notes from '@/components/Notes';
import Timer from '@/components/Timer';

const Index = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mac Productivity Suite</h1>
            <p className="text-muted-foreground">Calculator, Notes & Timer - All in one PWA</p>
          </div>
          {isInstallable && (
            <Button onClick={handleInstall} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Install App
            </Button>
          )}
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <CalcIcon className="h-4 w-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <TimerIcon className="h-4 w-4" />
              Timer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="mt-4">
            <Calculator />
          </TabsContent>
          
          <TabsContent value="notes" className="mt-4">
            <Notes />
          </TabsContent>
          
          <TabsContent value="timer" className="mt-4">
            <Timer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
