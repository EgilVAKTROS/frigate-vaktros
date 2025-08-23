import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { stackClientApp } from "@/api/stack";
import { useUser } from "@stackframe/react";
import { Shield, Camera, Video, Lock, User, Settings } from "lucide-react";

const LandingPage: React.FC = () => {
  const user = useUser();

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "Real-time Camera Monitoring",
      description:
        "Monitor multiple cameras simultaneously with advanced motion detection and AI-powered object recognition.",
    },
    {
      icon: <Video className="h-8 w-8 text-primary" />,
      title: "Smart Video Recording",
      description:
        "Automatic recording triggered by motion or specific events, with intelligent retention policies.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Private",
      description:
        "Your footage stays private with enterprise-grade security and local storage options.",
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Access Control",
      description:
        "Granular permissions and user management to control who can access your surveillance system.",
    },
    {
      icon: <Settings className="h-8 w-8 text-primary" />,
      title: "Easy Configuration",
      description:
        "Intuitive web interface for setup and configuration with advanced options for power users.",
    },
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: "Multi-User Support",
      description:
        "Share access with family members or team members with different permission levels.",
    },
  ];

  const handleSignIn = () => {
    console.log("Sign in clicked");
    // Try direct navigation to the Stack Auth handler
    window.location.href = "/handler/sign-in";
  };

  const handleSignUp = () => {
    console.log("Sign up clicked");
    // Try direct navigation to the Stack Auth handler
    window.location.href = "/handler/sign-up";
  };
  const handleSignOut = () => {
    console.log("Sign out clicked");
    // Navigate to sign-out handler
    window.location.href = "/handler/sign-out";
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center space-x-2 transition-opacity hover:opacity-80"
              >
                <Camera className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  VAKTROS
                </span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.displayName || user.primaryEmail}
                  </span>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={handleSignIn}>
                    Sign In
                  </Button>
                  <Button onClick={handleSignUp}>Get Started</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Smart Home
              <span className="block text-primary">Security Made Simple</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              VAKTROS is an open-source NVR with real-time local object
              detection for IP cameras. Monitor your home or business with
              AI-powered video surveillance that's private, secure, and easy to
              use.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!user ? (
                <>
                  <Button size="lg" onClick={handleSignUp} className="px-8">
                    Get Started Free (PLAY)
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleSignIn}>
                    Sign In
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={() => (window.location.href = "/")}>
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need for smart surveillance
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to keep you and your property safe
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-4xl border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center sm:p-12">
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                Ready to get started?
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of users who trust VAKTROS for their security
                needs.
              </p>
              <div className="mt-8">
                {!user ? (
                  <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                    <Button size="lg" onClick={handleSignUp}>
                      Create Account
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleSignIn}>
                      Sign In to Existing Account
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => (window.location.href = "/")}
                  >
                    Access Your Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center space-x-2 transition-opacity hover:opacity-80"
              >
                <Camera className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  VAKTROS
                </span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VAKTROS. Open source NVR with
              real-time AI object detection.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
