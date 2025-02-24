'use client';

import { useState } from 'react';
import { MealPlannerForm } from './components/meal-planner-form';
import { MealPlan } from './components/meal-plan';
import { MacroSummary } from './components/macro-summary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { MealPlan as MealPlanType } from '@/lib/types';

export default function Page() {
  const [mealPlan, setMealPlan] = useState<MealPlanType | null>(null);
  return (
    <div className="relative py-20 border-t overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100/30 via-rose-100/30 to-pink-100/30" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 backdrop-blur-3xl">
          <div className="absolute -left-[20%] top-[20%] h-96 w-96 rounded-full bg-gradient-to-br from-pink-200/30 to-rose-200/30 animate-pulse" />
          <div className="absolute -right-[20%] top-[10%] h-96 w-96 rounded-full bg-gradient-to-br from-rose-200/30 to-pink-200/30 animate-pulse [animation-delay:1s]" />
          <div className="absolute left-[10%] bottom-[10%] h-96 w-96 rounded-full bg-gradient-to-br from-pink-200/30 to-rose-200/30 animate-pulse [animation-delay:2s]" />
        </div>
      </div>
      <div className="container relative px-4 mx-auto">
        <div className="flex flex-col gap-4 mb-12 md:items-center md:text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Smart Meal Planning
          </h2>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            Enter your available ingredients and preferences, and let our AI
            create the perfect meal plan for you.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-[400px_1fr]">
          <MealPlannerForm onMealPlanGenerated={setMealPlan} />
          <div className="space-y-6">
            <MacroSummary mealPlan={mealPlan} />
            <MealPlan mealPlan={mealPlan} />
          </div>
        </div>
      </div>
    </div>
  );
}
