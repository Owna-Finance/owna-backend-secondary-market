-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING_SIGNATURE', 'ACTIVE', 'FILLED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Order" (
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

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_salt_key" ON "Order"("salt");
