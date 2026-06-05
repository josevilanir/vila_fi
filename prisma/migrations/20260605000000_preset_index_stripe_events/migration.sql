-- CreateIndex: improves listPresets and count queries filtering by userId
CREATE INDEX "Preset_userId_idx" ON "Preset"("userId");

-- CreateTable: stores processed Stripe event IDs for idempotency
CREATE TABLE "StripeEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);
