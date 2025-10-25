import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { PricingScheme, generatePricingDataPoints, generatePricingEquation } from '@/lib/pricingCalculator';

interface PricingSchemeChartProps {
  scheme: PricingScheme;
  height?: number;
}

export function PricingSchemeChart({ scheme, height = 400 }: PricingSchemeChartProps) {
  const dataPoints = generatePricingDataPoints(scheme);
  const equation = generatePricingEquation(scheme);

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-mono">{equation}</p>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={dataPoints} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="vehicleValue" 
            label={{ value: 'Vehicle Value ($)', position: 'insideBottom', offset: -5 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            className="text-xs"
          />
          <YAxis 
            label={{ value: 'Base Premium ($)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            className="text-xs"
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Base Premium']}
            labelFormatter={(label) => `Vehicle Value: $${Number(label).toLocaleString()}`}
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
          />
          <Legend 
            content={() => (
              <div className="text-xs text-center text-muted-foreground mt-2">
                Pricing Curve
              </div>
            )} 
          />
          
          {/* Floor Point Reference Line */}
          <ReferenceLine 
            x={scheme.floor_point} 
            stroke="hsl(var(--success))" 
            strokeDasharray="3 3"
            label={{ 
              value: 'Floor', 
              position: 'top',
              fill: 'hsl(var(--success))',
              fontSize: 12
            }}
          />
          
          {/* Ceiling Point Reference Line */}
          <ReferenceLine 
            x={scheme.ceiling_point} 
            stroke="hsl(var(--destructive))" 
            strokeDasharray="3 3"
            label={{ 
              value: 'Ceiling', 
              position: 'top',
              fill: 'hsl(var(--destructive))',
              fontSize: 12
            }}
          />
          
          {/* Main Line */}
          <Line 
            type="monotone" 
            dataKey="basePremium" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
