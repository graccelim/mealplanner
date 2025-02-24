'use client';

import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateMealPlan } from '@/app/actions';
import { toast } from 'sonner'; // Replacing useToast
import type { MealPlan } from '@/lib/types';

interface MealPlannerFormProps {
  onMealPlanGenerated: (mealPlan: MealPlan) => void;
}

export function MealPlannerForm({ onMealPlanGenerated }: MealPlannerFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [numberOfMeals, setNumberOfMeals] = useState('3');
  const [isLoading, setIsLoading] = useState(false);

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (ingredients.length === 0) {
      toast.error(
        'Please add at least one ingredient to generate a meal plan.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateMealPlan(
        ingredients,
        Number.parseInt(numberOfMeals)
      );

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.mealPlan) {
        onMealPlanGenerated(result.mealPlan);
      } else {
        throw new Error('Meal plan is undefined');
      }

      toast.success('Your meal plan has been generated.');
    } catch (error) {
      toast.error('Failed to generate meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/40">
      <CardHeader>
        <CardTitle>Available Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meals">Number of meals</Label>
          <Select value={numberOfMeals} onValueChange={setNumberOfMeals}>
            <SelectTrigger id="meals" className="bg-white/60">
              <SelectValue placeholder="Select number of meals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 meals per day</SelectItem>
              <SelectItem value="3">3 meals per day</SelectItem>
              <SelectItem value="4">4 meals per day</SelectItem>
              <SelectItem value="5">5 meals per day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Add ingredients</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter an ingredient"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addIngredient();
                }
              }}
              className="bg-white/60"
            />
            <Button
              type="button"
              onClick={addIngredient}
              size="icon"
              variant="secondary"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-rose-100 text-rose-700"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(index)}
                className="p-0.5 hover:bg-rose-200 rounded-full"
                disabled={isLoading}
              >
                <X className="w-3 h-3" />
                <span className="sr-only">Remove {ingredient}</span>
              </button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Meal Plan...
            </>
          ) : (
            'Generate Meal Plan'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
