
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface AuthFallbackProps {
  error: string;
  onRetry: () => void;
}

export const AuthFallback = ({ error, onRetry }: AuthFallbackProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">Connection Error</CardTitle>
          <CardDescription>
            Unable to connect to authentication service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            {error}
          </div>
          <Button onClick={onRetry} className="w-full" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Check your internet connection and try again
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
