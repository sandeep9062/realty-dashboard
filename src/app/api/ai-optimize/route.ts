import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Interface for property details
interface PropertyDetails {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  propertyType?: string; // e.g., "apartment", "house", "villa", "condo"
  amenities?: string[];
  features?: string[];
  yearBuilt?: number;
}

export async function POST(req: Request) {
  try {
    const propertyDetails: PropertyDetails = await req.json();

    // Validate required minimum information
    if (!propertyDetails.description && (!propertyDetails.title || !propertyDetails.location)) {
      return NextResponse.json(
        { error: "At least a description or title + location is required" },
        { status: 400 }
      );
    }

    // Create a comprehensive prompt with structured property information
   const prompt = `
You are an expert real estate copywriter working for a premium property listing platform. 
Your task is to write a clear, professional, and highly relevant property description that helps buyers or tenants quickly understand the value of the property and motivates them to take action.

Use ONLY the information provided below. Do NOT invent details.

PROPERTY DETAILS:
${propertyDetails.title ? `Title: ${propertyDetails.title}` : ""}
${propertyDetails.description ? `Raw Description: ${propertyDetails.description}` : ""}
${propertyDetails.price ? `Price: ₹${propertyDetails.price.toLocaleString()}` : ""}
${propertyDetails.location ? `Location: ${propertyDetails.location}` : ""}
${propertyDetails.propertyType ? `Property Type: ${propertyDetails.propertyType}` : ""}
${propertyDetails.bedrooms ? `Bedrooms: ${propertyDetails.bedrooms}` : ""}
${propertyDetails.bathrooms ? `Bathrooms: ${propertyDetails.bathrooms}` : ""}
${propertyDetails.squareFootage ? `Built-up Area: ${propertyDetails.squareFootage} sq ft` : ""}
${propertyDetails.yearBuilt ? `Year Built: ${propertyDetails.yearBuilt}` : ""}
${propertyDetails.amenities?.length ? `Amenities: ${propertyDetails.amenities.join(", ")}` : ""}
${propertyDetails.features?.length ? `Additional Features: ${propertyDetails.features.join(", ")}` : ""}

WRITING INSTRUCTIONS:
- Write in a professional, trustworthy real estate tone
- Be clear, specific, and buyer-focused
- Avoid exaggeration or marketing hype
- Avoid generic phrases like “perfect home” or “dream property”
- Do NOT use emojis
- Do NOT mention missing information
- Do NOT repeat the same points

STRUCTURE THE OUTPUT AS:
1. **Opening Paragraph**
   - Brief headline-style opening (1–2 lines)
   - Mention property type, location, and key selling point

2. **Property Overview**
   - Clear explanation of layout, size, and configuration
   - Mention bedrooms, bathrooms, and usable space naturally

3. **Features & Amenities**
   - Highlight amenities and features in sentence form (not bullet points)

4. **Location & Lifestyle**
   - Explain location advantages, connectivity, and neighborhood appeal
   - Keep it realistic and informative

5. **Call to Action**
   - Professional and subtle (e.g., “Contact us to schedule a viewing”)

LENGTH & FORMAT:
- 180–300 words
- Plain text only
- Short paragraphs
- No HTML, markdown, or bullet points

OUTPUT:
Return ONLY the final polished property description text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Clean and format the response
    let optimizedText = response.text?.trim() || "No description available";
    
    // Remove full HTML document structure if present
    optimizedText = optimizedText.replace(/<!DOCTYPE html>[\s\S]*?<body>[\s\S]*?<div class="container">([\s\S]*?)<\/div>[\s\S]*?<\/body>[\s\S]*?<\/html>/, "$1");
    optimizedText = optimizedText.replace(/<!DOCTYPE html>[\s\S]*?<body>[\s\S]*?<div>([\s\S]*?)<\/div>[\s\S]*?<\/body>[\s\S]*?<\/html>/, "$1");
    optimizedText = optimizedText.replace(/<!DOCTYPE html>[\s\S]*?<body>([\s\S]*?)<\/body>[\s\S]*?<\/html>/, "$1");
    
    // Remove all HTML tags
    optimizedText = optimizedText.replace(/<[^>]+>/g, "");
    
    // Trim any remaining whitespace
    optimizedText = optimizedText.trim();
    return NextResponse.json({ optimizedText });
  } catch (error) {
    console.error("AI_OPTIMIZE_ERROR:", error);
    return NextResponse.json({ error: "Failed to optimize description" }, { status: 500 });
  }
}
