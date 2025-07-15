
import { Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { toast } = useToast();
  
  const handleNotificationClick = () => {
    toast({
      title: "New fraud alert",
      description: "High-risk transaction detected from an unfamiliar location.",
      variant: "destructive",
    });
  };

  return (
    <header className="w-full border-b border-border/40 bg-shield-dark">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-shield-primary" />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-shield-primary">Fraud</span>
            <span className="text-white">Shield</span>
          </h1>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
          </Button>
          <div className="relative h-8 w-8 rounded-full bg-shield-primary flex items-center justify-center text-white font-medium">
            FS
          </div>
        </div>
      </div>
    </header>
  );
}
