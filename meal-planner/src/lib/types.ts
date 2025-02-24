export interface Ingredient {
    fdcId: number
    description: string
    nutrients: {
      protein: number
      carbohydrates: number
      fat: number
      calories: number
    }
  }
  
  export interface MealPlan {
    meals: {
      title: string
      description: string
      ingredients: Ingredient[]
      totalNutrients: {
        protein: number
        carbohydrates: number
        fat: number
        calories: number
      }
      imageUrl: string
      prepTime: string
    }[]
  }
  
  