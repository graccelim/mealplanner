import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Beef, GrapeIcon as Grain, Droplet } from 'lucide-react';
import type { MealPlan } from '@/lib/types';

interface MacroSummaryProps {
  mealPlan?: MealPlan | null;
}

export function MacroSummary({ mealPlan }: MacroSummaryProps) {
  const totalNutrients = mealPlan?.meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalNutrients.calories,
      protein: acc.protein + meal.totalNutrients.protein,
      carbohydrates: acc.carbohydrates + meal.totalNutrients.carbohydrates,
      fat: acc.fat + meal.totalNutrients.fat,
    }),
    { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
  ) ?? { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };

  return (
    <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          Daily Macro Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <MacroCard
            title="Calories"
            value={Math.round(totalNutrients.calories)}
            unit="kcal"
            icon={Activity}
            color="from-rose-400/20 to-pink-400/20 hover:from-rose-400/30 hover:to-pink-400/30"
            textColor="text-rose-600"
            isEmpty={!mealPlan}
          />
          <MacroCard
            title="Protein"
            value={Math.round(totalNutrients.protein)}
            unit="g"
            icon={Beef}
            color="from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30"
            textColor="text-pink-600"
            isEmpty={!mealPlan}
          />
          <MacroCard
            title="Carbs"
            value={Math.round(totalNutrients.carbohydrates)}
            unit="g"
            icon={Grain}
            color="from-rose-400/20 to-pink-400/20 hover:from-rose-400/30 hover:to-pink-400/30"
            textColor="text-rose-600"
            isEmpty={!mealPlan}
          />
          <MacroCard
            title="Fat"
            value={Math.round(totalNutrients.fat)}
            unit="g"
            icon={Droplet}
            color="from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30"
            textColor="text-pink-600"
            isEmpty={!mealPlan}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MacroCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  textColor,
  isEmpty,
}: {
  title: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  isEmpty: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${color} transition-all duration-300 group`}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-white/60" />
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-foreground/70">{title}</div>
          <Icon className={`w-4 h-4 ${textColor}`} />
        </div>
        <div className="flex items-baseline gap-1">
          {isEmpty ? (
            <div className="text-sm text-muted-foreground">
              Start generating to see macros
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{unit}</div>
            </>
          )}
        </div>
        <div className="absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/20 to-white/30" />
      </div>
    </div>
  );
}
