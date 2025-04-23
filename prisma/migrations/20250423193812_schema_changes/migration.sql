/*
  Warnings:

  - You are about to drop the `landmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visited_landmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visiting_plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "visited_landmarks" DROP CONSTRAINT "visited_landmarks_landmark_id_fkey";

-- DropForeignKey
ALTER TABLE "visiting_plans" DROP CONSTRAINT "visiting_plans_landmark_id_fkey";

-- DropTable
DROP TABLE "landmarks";

-- DropTable
DROP TABLE "visited_landmarks";

-- DropTable
DROP TABLE "visiting_plans";

-- CreateTable
CREATE TABLE "Landmark" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "latitude" DECIMAL(12,8) NOT NULL,
    "longitude" DECIMAL(12,8) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100),

    CONSTRAINT "Landmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitingPlan" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "VisitingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanItem" (
    "id" SERIAL NOT NULL,
    "visitingPlanId" INTEGER NOT NULL,
    "landmarkId" INTEGER NOT NULL,
    "plannedDate" DATE NOT NULL,
    "visited" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PlanItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_visitingPlanId_fkey" FOREIGN KEY ("visitingPlanId") REFERENCES "VisitingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_landmarkId_fkey" FOREIGN KEY ("landmarkId") REFERENCES "Landmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;
