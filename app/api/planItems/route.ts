import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const visited = searchParams.get("visited");
    const planId = searchParams.get("planId");

    if (!planId) {
        return NextResponse.json({ error: "planId query parameter is required" }, { status: 400 });
    }

    try {
        const planItems = await prisma.planItem.findMany({
            where: {
                visitingPlanId: Number(planId),
                ...(visited !== null && { visited: visited === "true" }),
            },
            include: {
                landmark: true,
            },
        });

        const landmarks = planItems.map((item) => ({
            id: item.landmark.id,
            name: item.landmark.name,
            description: item.landmark.description,
            category: item.landmark.category,
            visited: item.visited,
            planId: item.visitingPlanId, // front-end için planId'yi ekliyoruz
        }));

        return NextResponse.json(landmarks);
    } catch (error) {
        console.error("Error fetching plan items:", error);
        return NextResponse.json({ error: "Failed to fetch landmarks" }, { status: 500 });
    }
}
