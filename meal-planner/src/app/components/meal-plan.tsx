import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, UtensilsCrossed, Utensils } from 'lucide-react';
import type { MealPlan as MealPlanType } from '@/lib/types';

interface MealPlanProps {
  mealPlan?: MealPlanType | null;
}

export function MealPlan({ mealPlan }: MealPlanProps) {
  return (
    <Card className="border-0 shadow-lg backdrop-blur-sm bg-white/40">
      <CardHeader>
        <CardTitle>Your Meal Plan</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on any meal to search for recipes
        </p>
      </CardHeader>
      <CardContent>
        {!mealPlan ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {mealPlan.meals.map((meal, index) => (
              <MealCard
                key={index}
                title={meal.title}
                description={meal.description}
                time={meal.prepTime}
                calories={Math.round(meal.totalNutrients.calories)}
                protein={Math.round(meal.totalNutrients.protein)}
                carbs={Math.round(meal.totalNutrients.carbohydrates)}
                fat={Math.round(meal.totalNutrients.fat)}
                image={meal.imageUrl}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Utensils className="w-12 h-12 mb-4 text-rose-500/50" />
      <h3 className="text-lg font-medium text-muted-foreground">
        No meals generated yet
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Add your available ingredients and generate a personalized meal plan
      </p>
    </div>
  );
}

function MealCard({
  title,
  description,
  time,
  calories,
  protein,
  carbs,
  fat,
  image,
}: {
  title: string;
  description: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
}) {
  const searchRecipe = () => {
    const searchQuery = encodeURIComponent(`${title} recipe`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  return (
    <div
      onClick={searchRecipe}
      className="flex gap-4 p-4 transition-all duration-300 rounded-lg hover:bg-rose-50/50 group cursor-pointer"
    >
      <img
        src={image || '/placeholder.svg'}
        alt={description}
        width={100}
        height={100}
        className="object-cover transition-transform duration-300 rounded-lg group-hover:scale-105"
      />
      <div className="flex flex-col flex-1 gap-2">
        <div>
          <h3 className="font-medium group-hover:text-rose-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-rose-500" />
          <span>{time}</span>
          <UtensilsCrossed className="w-4 h-4 ml-2 text-rose-500" />
          <span>{calories} kcal</span>
        </div>
        <div className="flex gap-3 text-sm">
          <span>Protein: {protein}g</span>
          <span>Carbs: {carbs}g</span>
          <span>Fat: {fat}g</span>
        </div>
      </div>
    </div>
  );
}
