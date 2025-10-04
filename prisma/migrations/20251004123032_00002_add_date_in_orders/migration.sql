/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Order";

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_SIGNATURE',
    "maker" VARCHAR(255) NOT NULL,
    "makerToken" VARCHAR(255) NOT NULL,
    "makerTokenDecimals" INTEGER NOT NULL,
    "makerAmount" DECIMAL(78,0) NOT NULL,
    "taker" VARCHAR(255),
    "takerToken" VARCHAR(255) NOT NULL,
    "takerTokenDecimals" INTEGER NOT NULL,
    "takerAmount" DECIMAL(78,0) NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "tx_hash" VARCHAR(255),
    "signature" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orders_salt_key" ON "Orders"("salt");
