import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, Users } from "lucide-react";

const PROFESSIONAL_MONTHLY = 39.99;
const PROFESSIONAL_YEARLY = 399.99;
const YEARLY_SAVINGS = Math.round(12 * PROFESSIONAL_MONTHLY - PROFESSIONAL_YEARLY);

export const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Explore the map and regulation pins",
      features: [
        "View the full global regulation map",
        "Click on pins to see regulation summaries",
        "Create an account to get started",
        "Upgrade anytime for search, bookmarks & export"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Professional",
      price: `$${PROFESSIONAL_MONTHLY}`,
      period: "/month",
      yearlyPrice: `$${PROFESSIONAL_YEARLY}`,
      yearlyPeriod: "/year",
      savings: `Save $${YEARLY_SAVINGS}/year`,
      description: "Full access with 7-day free trial",
      features: [
        "Unlimited regulation search",
        "Advanced filtering by region, sector & framework",
        "Unlimited bookmarks",
        "PDF & CSV export",
        "Regulation detail pages & source links",
        "7-day free trial, then billed monthly or yearly"
      ],
      buttonText: "Start 7-Day Free Trial",
      buttonVariant: "default" as const,
      popular: true
    }
  ];

  return (
    <div id="pricing" className="py-16 bg-gray-50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as your compliance needs grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                  {'yearlyPrice' in plan && (
                    <>
                      <p className="text-sm text-gray-500 mt-2">or {plan.yearlyPrice}{plan.yearlyPeriod}</p>
                      <p className="text-sm font-medium text-green-600 mt-1">{plan.savings}</p>
                    </>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include access to our comprehensive regulation database
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Compliant
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Real-time Updates
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Global Coverage
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

