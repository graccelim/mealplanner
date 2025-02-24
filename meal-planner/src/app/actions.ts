"use server"

import { revalidatePath } from "next/cache"
import type { Ingredient } from "@/lib/types"

const BASE_URL = "http://localhost:3000";
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function generateMealPlan(ingredients: string[], numberOfMeals: number) {
  try {
    // 1. Get nutrition data for ingredients using absolute URL
    const nutritionPromises = ingredients.map(async (ingredient) => {
      const response = await fetch(`${BASE_URL}/api/nutrition?query=${encodeURIComponent(ingredient)}`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nutrition data");
      }
      const data = await response.json();
      return data.ingredients[0];
    });

    const ingredientsWithNutrition = await Promise.all(nutritionPromises);

    // 2. Generate meal plan
    const mealPlanResponse = await fetch(`${BASE_URL}/api/generate-meal-plan`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients, numberOfMeals }),
    });

    if (!mealPlanResponse.ok) {
      throw new Error("Failed to generate meal plan");
    }

    const mealPlan = await mealPlanResponse.json();

    // 3. Generate images for each meal
    const mealsWithImages = await Promise.all(
      mealPlan.meals.map(async (meal: any) => {
        const response = await fetch(`${BASE_URL}/api/generate-image`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: meal.title }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate image");
        }

        const { imageUrl } = await response.json();
        return { ...meal, imageUrl };
      })
    );

    // 4. Calculate total nutrients for each meal
    const completeMealPlan = {
      meals: mealsWithImages.map((meal: any) => {
        const mealIngredients = meal.ingredients
          .map((ingredient: string) =>
            ingredientsWithNutrition.find((i) => i.description.toLowerCase().includes(ingredient.toLowerCase()))
          )
          .filter(Boolean);

        const totalNutrients = mealIngredients.reduce(
          (acc: any, ingredient: Ingredient) => ({
            protein: acc.protein + ingredient.nutrients.protein,
            carbohydrates: acc.carbohydrates + ingredient.nutrients.carbohydrates,
            fat: acc.fat + ingredient.nutrients.fat,
            calories: acc.calories + ingredient.nutrients.calories,
          }),
          { protein: 0, carbohydrates: 0, fat: 0, calories: 0 }
        );

        return {
          ...meal,
          ingredients: mealIngredients,
          totalNutrients,
        };
      }),
    };

    revalidatePath("/");
    return { mealPlan: completeMealPlan };
  } catch (error) {
    console.error("Meal Plan Generation Error:", error);
    return { error: "Failed to generate meal plan" };
  }
}
