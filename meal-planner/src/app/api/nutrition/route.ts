import { NextResponse } from "next/server"

const USDA_API_BASE = "https://api.nal.usda.gov/fdc/v1"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${USDA_API_BASE}/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(
        query,
      )}&pageSize=5&dataType=Survey (FNDDS)`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch nutrition data")
    }

    const data = await response.json()

    // Log all nutrient names from the first food item to see exact naming
    if (data.foods[0]) {
      console.log(
        "Available nutrients:",
        data.foods[0].foodNutrients.map((n: any) => ({
          name: n.nutrientName,
          value: n.value,
          unit: n.unitName,
        })),
      )
    }

    // Transform the USDA response into our simplified format
    const ingredients = data.foods.map((food: any) => {
      const getNutrientValue = (nutrientNames: string[]) => {
        const nutrient = food.foodNutrients.find((n: any) =>
          nutrientNames.some((name) => n.nutrientName.toLowerCase().includes(name.toLowerCase())),
        )
        return nutrient ? nutrient.value : 0
      }

      const nutrients = {
        protein: getNutrientValue(["protein"]),
        carbohydrates: getNutrientValue(["carbohydrate", "carbs"]),
        // Try multiple possible names for fat
        fat: getNutrientValue(["total lipid", "total fat", "lipids"]),
        calories: getNutrientValue(["energy", "calories", "kcal"]),
      }

      // console.log(`Nutrients for ${food.description}:`, nutrients)

      return {
        fdcId: food.fdcId,
        description: food.description,
        nutrients,
      }
    })

    return NextResponse.json({ ingredients })
  } catch (error) {
    console.error("Nutrition API Error:", error)
    return NextResponse.json({ error: "Failed to fetch nutrition data" }, { status: 500 })
  }
}

