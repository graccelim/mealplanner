import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log(prompt)

    const response = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: `A beautiful, appetizing photo of ${prompt}, food photography, professional lighting, high resolution`,
      parameters: {
        negative_prompt: 'blurry, bad quality, distorted, deformed',
        width: 768,
        height: 768,
      },
    });

    // Convert blob to base64
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    return NextResponse.json({ imageUrl: base64Image });
  } catch (error) {
    console.error('Image Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
