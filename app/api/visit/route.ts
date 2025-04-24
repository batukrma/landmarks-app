import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

// PATCH: Landmark'ı ziyaret edilmiş olarak işaretleme
export async function PATCH(req: Request) {
    try {
        // Request body'den ID'yi al
        const { landmarkId } = await req.json();

        if (!landmarkId || isNaN(Number(landmarkId))) {
            return NextResponse.json({ error: "Invalid landmark ID" }, { status: 400 });
        }

        // PlanItem tablosundaki ziyaret edilmemiş landmark'ı güncelle
        const updatedLandmark = await prisma.planItem.updateMany({
            where: {
                landmarkId: Number(landmarkId),
                visited: false, // Ziyaret edilmemiş olanları güncelle
            },
            data: {
                visited: true, // Ziyaret edilmiş olarak işaretle
            },
        });

        if (updatedLandmark.count > 0) {
            return NextResponse.json({ message: "Landmark marked as visited." });
        } else {
            return NextResponse.json({ message: "No updates were made, landmark might already be visited." });
        }
    } catch (error) {
        console.error("Error marking landmark as visited:", error);
        return NextResponse.json({ error: "Failed to mark landmark as visited" }, { status: 500 });
    }
}
