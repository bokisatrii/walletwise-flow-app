
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, Target, Lightbulb, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

// Mock data for insights
const monthlyComparison = [
  { month: "Jan", spending: 3200 },
  { month: "Feb", spending: 3400 },
  { month: "Mar", spending: 3100 },
  { month: "Apr", spending: 3800 },
  { month: "May", spending: 3600 },
  { month: "Jun", spending: 4200 },
];

const categoryTrends = [
  { category: "Food", thisMonth: 800, lastMonth: 720, change: 11.1 },
  { category: "Transport", thisMonth: 400, lastMonth: 450, change: -11.1 },
  { category: "Entertainment", thisMonth: 300, lastMonth: 250, change: 20.0 },
  { category: "Shopping", thisMonth: 500, lastMonth: 600, change: -16.7 },
];

const Insights = () => {
  const handleGenerateInsights = () => {
    // Mock AI generation - in real app this would call an AI service
    console.log("Generating new AI insights...");
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
            <p className="text-gray-600">Personalized financial analysis</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleGenerateInsights}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Summary Card */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Monthly Financial Summary</h3>
              <p className="text-sm text-gray-600">AI-powered analysis of your spending patterns</p>
            </div>
          </div>
          
          <div className="bg-white/70 rounded-lg p-4 space-y-3">
            <p className="text-gray-800 leading-relaxed">
              📈 <strong>Great news!</strong> You've saved $400 more this month compared to last month. 
              Your disciplined approach to transportation costs has really paid off.
            </p>
            <p className="text-gray-800 leading-relaxed">
              🎯 <strong>Areas to watch:</strong> Entertainment spending increased by 20% this month. 
              Consider setting a monthly entertainment budget of $250 to stay on track.
            </p>
            <p className="text-gray-800 leading-relaxed">
              💡 <strong>Opportunity:</strong> You could save an additional $150/month by meal prepping 
              instead of dining out. This could boost your annual savings by $1,800!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Savings Rate</p>
                  <p className="text-sm text-gray-600">25% above average</p>
                </div>
              </div>
              <Badge className="bg-accent-100 text-accent-700">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Monthly Goal</p>
                  <p className="text-sm text-gray-600">78% progress</p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-700">On Track</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyComparison}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(value) => [`$${value}`, "Spending"]} />
                <Line 
                  type="monotone" 
                  dataKey="spending" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Your spending has increased 12% over the past 6 months
          </p>
        </CardContent>
      </Card>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryTrends.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{category.category}</p>
                  <p className="text-sm text-gray-600">
                    ${category.thisMonth} this month vs ${category.lastMonth} last month
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {category.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-accent" />
                  )}
                  <span className={`text-sm font-medium ${
                    category.change > 0 ? "text-red-500" : "text-accent"
                  }`}>
                    {category.change > 0 ? "+" : ""}{category.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-1">Set up automatic savings</h4>
              <p className="text-sm text-blue-700">
                Transfer $500 monthly to savings to reach your $6,000 yearly goal
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-1">Optimize subscriptions</h4>
              <p className="text-sm text-green-700">
                Cancel unused subscriptions to save $25/month ($300/year)
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-1">Food budget optimization</h4>
              <p className="text-sm text-orange-700">
                Try meal planning to reduce food expenses by 15-20%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;
