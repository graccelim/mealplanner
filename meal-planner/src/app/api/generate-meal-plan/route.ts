import { NextResponse } from "next/server"

export const runtime = "edge" // This line specifies that this is an Edge Function

export async function POST(request: Request) {
  try {
    const { ingredients, numberOfMeals } = await request.json()

    if (!ingredients || !numberOfMeals) {
      return NextResponse.json({ error: "Ingredients and number of meals are required" }, { status: 400 })
    }

    // Define expected JSON schema explicitly in the prompt
    const prompt = `You are a meal planning assistant. Generate ${numberOfMeals} meals using ONLY these ingredients: ${ingredients.join(
      ", ",
    )}.
    Each meal must be nutritionally balanced. 

    **Respond ONLY with a valid JSON object in this format:**
    \`\`\`json
    {
      "meals": [
        {
          "title": "Meal name",
          "description": "Brief description",
          "ingredients": ["ingredient1", "ingredient2"],
          "prepTime": "XX mins"
        }
      ]
    }
    \`\`\`
    
    No extra text, no explanations.`

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log(result[0].generated_text)

    // **Extract JSON Safely**
    let extractedJson
    try {
      // Extract JSON from within triple backticks if they exist
      const match = result[0].generated_text.match(/```json([\s\S]*?)```/)
      extractedJson = match ? match[1].trim() : result[0].generated_text.trim()

      // Parse JSON safely
      const mealPlan = JSON.parse(extractedJson)
      return NextResponse.json(mealPlan)
    } catch (error) {
      console.error("JSON Parsing Error:", error)
      return NextResponse.json({ error: "Failed to parse meal plan JSON" }, { status: 500 })
    }
  } catch (error) {
    console.error("Meal Plan Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 })
  }
}

