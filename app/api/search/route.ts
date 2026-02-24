import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { inventory } from "@/lib/inventory";
import { z } from "zod";

// Initialize OpenAI securely
const apiKey = process.env.OPENAI_API_KEY; 
if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

const openai = new OpenAI({ apiKey });

// Zod schema to validate final response
const responseSchema = z.object({
    results: z.array(
        z.object({
            id: z.number(),
            reason: z.string(),
        })
    ),
});

// Allowed tags from inventory
const allowedTags = inventory.flatMap(item => item.tags);

export async function POST(req: NextRequest) {
    try {
        const { query = "", minPrice = 0, maxPrice = Infinity, selectedTags = [] } =
            await req.json();

        // Input Validation
        if (typeof minPrice !== "number" || typeof maxPrice !== "number") {
            return NextResponse.json(
                { results: [], error: "minPrice and maxPrice must be numbers" },
                { status: 400 }
            );
        }

        if (minPrice > maxPrice) {
            return NextResponse.json(
                { results: [], error: "Min price cannot exceed max price" },
                { status: 400 }
            );
        }

        if (!Array.isArray(selectedTags) || !selectedTags.every(tag => allowedTags.includes(tag))) {
            return NextResponse.json(
                { results: [], error: "Invalid tags selected" },
                { status: 400 }
            );
        }

        // Prepare OpenAI Prompt
        const systemPrompt = `
You are a travel recommendation assistant.

You MUST:
- Only return items from the provided inventory.
- Never invent destinations.
- Only return IDs that exist in the inventory.
- Respect min/max price and selected tags.
- If nothing matches, return empty results.

Return response in this JSON format:
{
  "results": [
    { "id": number, "reason": "short explanation" }
  ]
}
`;

        const userPrompt = `
User query: "${query}"
Min price: ${minPrice}, Max price: ${maxPrice}
Selected tags: ${JSON.stringify(selectedTags)}

Inventory: ${JSON.stringify(inventory)}
`;

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
        });

        const content = completion.choices[0].message.content;
        if (!content) return NextResponse.json({ results: [] });

        // Parse and Validate
        const parsed = responseSchema.parse(JSON.parse(content));

        // HARD GUARDRAIL: Filter only IDs in inventory
        const validIds = inventory.map(item => item.id);
        const safeResults = parsed.results.filter(r => validIds.includes(r.id));

        // Fallback if nothing matched
        const finalResults =
            safeResults.length > 0
                ? safeResults
                : [
                    {
                        id: inventory[0].id,
                        reason: "No exact match, showing first item as fallback",
                    },
                ];

        return NextResponse.json({ results: finalResults });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { results: [], error: "Internal server error" },
            { status: 500 }
        );
    }
}


