-- CreateTable
CREATE TABLE "SlackNotification" (
    "id" BIGSERIAL NOT NULL,
    "isSent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlackNotification_pkey" PRIMARY KEY ("id")
);
