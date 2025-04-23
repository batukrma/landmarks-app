/*
  Warnings:

  - You are about to drop the `Landmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VisitingPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlanItem" DROP CONSTRAINT "PlanItem_landmarkId_fkey";

-- DropForeignKey
ALTER TABLE "PlanItem" DROP CONSTRAINT "PlanItem_visitingPlanId_fkey";

-- DropTable
DROP TABLE "Landmark";

-- DropTable
DROP TABLE "PlanItem";

-- DropTable
DROP TABLE "VisitingPlan";

-- CreateTable
CREATE TABLE "landmarks" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "latitude" DECIMAL(12,8) NOT NULL,
    "longitude" DECIMAL(12,8) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100),

    CONSTRAINT "landmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visiting_plans" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "visiting_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_items" (
    "id" SERIAL NOT NULL,
    "visitingPlanId" INTEGER NOT NULL,
    "landmarkId" INTEGER NOT NULL,
    "plannedDate" DATE NOT NULL,
    "visited" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "plan_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "plan_items" ADD CONSTRAINT "plan_items_visitingPlanId_fkey" FOREIGN KEY ("visitingPlanId") REFERENCES "visiting_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_items" ADD CONSTRAINT "plan_items_landmarkId_fkey" FOREIGN KEY ("landmarkId") REFERENCES "landmarks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
