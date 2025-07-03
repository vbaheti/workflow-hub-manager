
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, TrendingDown, Target, Users, DollarSign } from 'lucide-react';

interface InsightData {
  id: string;
  type: 'alert' | 'prediction' | 'anomaly' | 'opportunity';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  actionable: boolean;
  metrics?: {
    current: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  };
}

const AegisInsights = () => {
  // Mock insights data - in real implementation this would come from AI analysis
  const insights: InsightData[] = [
    {
      id: '1',
      type: 'alert',
      title: 'Burn Rate Alert: Mumbai Financial Hub',
      description: 'Project is at 85% of budget with 50% of quarter remaining. Immediate cost optimization required.',
      severity: 'high',
      confidence: 95,
      actionable: true,
      metrics: {
        current: 85,
        target: 50,
        trend: 'up'
      }
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Performance Anomaly: Agent John Smith',
      description: 'Collection rate dropped 30% this week. Consider reassignment or additional training.',
      severity: 'medium',
      confidence: 87,
      actionable: true,
      metrics: {
        current: 70,
        target: 100,
        trend: 'down'
      }
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Revenue Forecast: Q4 Target Achievement',
      description: 'Based on current trends, 98% probability of achieving Q4 revenue target 2 weeks early.',
      severity: 'low',
      confidence: 98,
      actionable: false,
      metrics: {
        current: 92,
        target: 100,
        trend: 'up'
      }
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Route Optimization Opportunity',
      description: 'Reordering routes in South Mumbai can save 15% travel time and increase service capacity.',
      severity: 'medium',
      confidence: 78,
      actionable: true,
      metrics: {
        current: 100,
        target: 115,
        trend: 'up'
      }
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'prediction':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'anomaly':
        return <TrendingDown className="h-5 w-5 text-orange-500" />;
      case 'opportunity':
        return <Target className="h-5 w-5 text-green-500" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            Aegis Insights Engine
          </h3>
          <p className="text-sm text-muted-foreground">AI-powered predictive analytics and smart alerts</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          {insights.length} Active Insights
        </Badge>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {insights.filter(i => i.severity === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictions</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {insights.filter(i => i.type === 'prediction').length}
            </div>
            <p className="text-xs text-muted-foreground">Forecasting outcomes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {insights.filter(i => i.type === 'opportunity').length}
            </div>
            <p className="text-xs text-muted-foreground">Growth opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Model accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <Alert key={insight.id} className="border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight.type)}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge className={getSeverityColor(insight.severity)} variant="secondary">
                      {insight.severity}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {insight.type}
                    </Badge>
                  </div>
                  <AlertDescription className="text-sm text-muted-foreground">
                    {insight.description}
                  </AlertDescription>
                  
                  {insight.metrics && (
                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Progress:</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((insight.metrics.current / insight.metrics.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{insight.metrics.current}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {insight.metrics.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : insight.metrics.trend === 'down' ? (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        ) : (
                          <div className="h-3 w-3 bg-gray-400 rounded-full" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}% confidence
                  </div>
                  {insight.actionable && (
                    <Badge className="mt-1 bg-green-100 text-green-800" variant="secondary">
                      Actionable
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default AegisInsights;
