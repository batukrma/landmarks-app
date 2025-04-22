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
CREATE TABLE "visited_landmarks" (
    "id" SERIAL NOT NULL,
    "landmark_id" INTEGER NOT NULL,
    "visited_date" DATE NOT NULL,
    "visitor_name" VARCHAR(255),

    CONSTRAINT "visited_landmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visiting_plans" (
    "id" SERIAL NOT NULL,
    "user_name" VARCHAR(255),
    "landmark_id" INTEGER,
    "planned_date" DATE,
    "note" TEXT,

    CONSTRAINT "visiting_plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "visited_landmarks" ADD CONSTRAINT "visited_landmarks_landmark_id_fkey" FOREIGN KEY ("landmark_id") REFERENCES "landmarks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "visiting_plans" ADD CONSTRAINT "visiting_plans_landmark_id_fkey" FOREIGN KEY ("landmark_id") REFERENCES "landmarks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
