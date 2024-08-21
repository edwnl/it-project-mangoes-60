import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const categories = [
  "1ml Luer Slip Syringe", "5ml Luer Lock Syringes",
  "3ml Luer Lock Syringes",
  "10ml Luer Slip Syringes",
  "Thermal Shock Blankets",
  "Cold/Ice Packs",
  "Adhesive Remover Wipe",
  "Eye Patch",
  "Tubular Bandage Roll",
  "Zinc Paste Bandage",
  "Pressure Monitoring",
  "Paediatric Oxygen Mask with 2m Tubing",
  "Silicon Anaesthetic Face Mask",
  "Nasal prongs O2 Cannula with CO2 sample line",
  "Adult Intubating Stylet",
  "Nasopharyngeal Tube"
];

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure the uploads directory exists
  const uploadsDir = join(process.cwd(), 'public/uploads');
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  // Save file to disk
  const filePath = join(uploadsDir, file.name);
  try {
    await writeFile(filePath, buffer);
  } catch (err) {
    console.error('Failed to write file:', err);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }

  // Create a base64 representation of the image
  const base64Image = buffer.toString('base64');

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze the item in this image and determine the top three categories it best fits into: ${categories.join(', ')}. Only respond with the category names.` },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    console.log(response)
    const category = response.choices[0].message.content;
    console.log(category)

    return NextResponse.json({ 
      message: 'File uploaded and analyzed successfully',
      category: category
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Error analyzing image' }, { status: 500 });
  }
}