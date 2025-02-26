import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { ingredients, numberOfMeals } = await request.json();

    if (!ingredients || !numberOfMeals) {
      return NextResponse.json(
        { error: 'Ingredients and number of meals are required' },
        { status: 400 }
      );
    }

    // Define expected JSON schema explicitly in the prompt
    const prompt = `You are a meal planning assistant. Generate ${numberOfMeals} meals using ONLY these ingredients: ${ingredients.join(
      ', '
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
    
    No extra text, no explanations.`;

    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    console.log(response.generated_text);

    // **Extract JSON Safely**
    let extractedJson;
    try {
      // Extract JSON from within triple backticks if they exist
      const match = response.generated_text.match(/```json([\s\S]*?)```/);
      extractedJson = match ? match[1].trim() : response.generated_text.trim();

      // Parse JSON safely
      const mealPlan = JSON.parse(extractedJson);
      return NextResponse.json(mealPlan);
    } catch (error) {
      console.error('JSON Parsing Error:', error);
      return NextResponse.json({ error: 'Failed to parse meal plan JSON' }, { status: 500 });
    }
  } catch (error) {
    console.error('Meal Plan Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}
