import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                DreamForge
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform your dreams into beautiful, AI-generated stories. Share your dream title and description, 
              and watch as our intelligent system crafts enchanting narratives from your subconscious adventures.
            </p>
          </div>

          {/* Welcome Message for Logged In Users */}
          {user && (
            <Card className="max-w-2xl mx-auto mb-12">
              <CardHeader>
                <CardTitle>Hello, {user.name}! </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ready to turn your dreams into stories? The dream generation feature will be available in the next version.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Feature Preview */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Dream Input</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simply enter your dream title and description to get started.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">AI Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our AI interprets your dreams and creates captivating stories.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Share & Explore</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share your dream stories and explore others' imaginative tales.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;