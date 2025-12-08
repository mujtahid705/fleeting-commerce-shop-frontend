import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Test Page - Styling Verification
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tailwind CSS Test</CardTitle>
              <CardDescription>
                This card should have proper styling if Tailwind is working
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you can see this text with proper styling, Tailwind CSS is
                working correctly.
              </p>
              <div className="flex gap-2">
                <Button variant="default">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Component Test</CardTitle>
              <CardDescription>
                Testing UI components and badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-4 rounded-lg">
                  <p className="text-white font-semibold">
                    Gradient background test
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            If you can see all the styling above, your Next.js app is working
            correctly!
          </p>
        </div>
      </div>
    </div>
  );
}
