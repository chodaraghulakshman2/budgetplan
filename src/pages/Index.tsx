import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Target, LogIn } from "lucide-react";

const Index = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Budget Planner
            </h1>
            <p className="text-muted-foreground mt-2">
              Take control of your finances and achieve your goals
            </p>
          </div>
          <Link to="/auth">
            <Button size="lg">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">
            Smart Financial Management Made Simple
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your income, manage expenses, set goals, and plan events all in one place. 
            Get insights into your spending patterns with beautiful charts and reports.
          </p>
          <Link to="/auth">
            <Button size="lg" className="mr-4">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-success mx-auto mb-4" />
              <CardTitle>Track Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Monitor all your income sources including salary, freelancing, and investments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingDown className="w-12 h-12 text-destructive mx-auto mb-4" />
              <CardTitle>Manage Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Categorize and track your expenses to understand your spending patterns.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Set Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Create financial goals and track your progress towards achieving them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <DollarSign className="w-12 h-12 text-warning mx-auto mb-4" />
              <CardTitle>Plan Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Budget for special events and occasions with dedicated event planning tools.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Stats */}
        <div className="bg-accent rounded-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-6">See What You Can Achieve</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">
                {formatCurrency(75000)}
              </div>
              <p className="text-sm text-muted-foreground">Monthly Income</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive mb-2">
                {formatCurrency(33000)}
              </div>
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(42000)}
              </div>
              <p className="text-sm text-muted-foreground">Monthly Savings</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Take Control?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who are already managing their finances smarter.
          </p>
          <Link to="/auth">
            <Button size="lg">
              Start Your Financial Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;