import { useUser } from "@stackframe/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield } from "lucide-react";

interface UserProfileProps {
  className?: string;
  showDetails?: boolean;
}

export function UserProfile({ className, showDetails = true }: UserProfileProps) {
  const user = useUser();

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Not signed in</p>
              <p className="text-xs text-muted-foreground">Sign in to view profile</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profileImageUrl ?? undefined} alt={user.displayName ?? user.primaryEmail ?? undefined} />
            <AvatarFallback>
              {(user.displayName || user.primaryEmail || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">
              {user.displayName || "User"}
            </CardTitle>
            <CardDescription className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>{user.primaryEmail}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary">
            <Shield className="h-3 w-3 mr-1" />
            Stack Auth
          </Badge>
        </div>
      </CardHeader>
      
      {showDetails && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {user.id && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium">User ID:</span>
                <span className="text-muted-foreground font-mono">{user.id}</span>
              </div>
            )}
            
            {(user as any).createdAt && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Member since:</span>
                <span className="text-muted-foreground">
                  {new Date((user as any).createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {(user as any).updatedAt && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Last updated:</span>
                <span className="text-muted-foreground">
                  {new Date((user as any).updatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {(user as any).emailVerified && (
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ Email Verified
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
