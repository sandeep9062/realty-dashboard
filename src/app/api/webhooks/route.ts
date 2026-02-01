import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Webhook handler implementation will depend on the service calling it
    console.log("Webhook received:", body);
    
    return NextResponse.json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Webhook endpoint is active" });
}