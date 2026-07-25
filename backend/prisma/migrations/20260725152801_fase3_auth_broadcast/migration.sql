/*
  Warnings:

  - You are about to drop the column `sent_at` on the `broadcast_notifications` table. All the data in the column will be lost.
  - Added the required column `name` to the `super_admins` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BroadcastTarget" AS ENUM ('SEMUA', 'PER_APLIKASI', 'PER_TENANT');

-- CreateEnum
CREATE TYPE "BroadcastStatus" AS ENUM ('TERKIRIM', 'DRAFT');

-- DropIndex
DROP INDEX "broadcast_notifications_sent_at_idx";

-- AlterTable
ALTER TABLE "broadcast_notifications" DROP COLUMN "sent_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "recipient_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "BroadcastStatus" NOT NULL DEFAULT 'TERKIRIM',
ADD COLUMN     "target" "BroadcastTarget" NOT NULL DEFAULT 'SEMUA',
ADD COLUMN     "tenant_id" UUID;

-- AlterTable
-- Kolom baru pada tabel yang bisa saja sudah berisi akun di server: diisi dulu
-- dengan nilai sementara, defaultnya baru dilepas setelahnya.
ALTER TABLE "super_admins" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Super Admin';
ALTER TABLE "super_admins" ALTER COLUMN "name" DROP DEFAULT;

-- CreateTable
CREATE TABLE "token_blacklist" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_reads" (
    "id" UUID NOT NULL,
    "notification_id" TEXT NOT NULL,
    "admin_id" UUID NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_reads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_blacklist_token_key" ON "token_blacklist"("token");

-- CreateIndex
CREATE INDEX "token_blacklist_created_at_idx" ON "token_blacklist"("created_at");

-- CreateIndex
CREATE INDEX "notification_reads_admin_id_idx" ON "notification_reads"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_reads_notification_id_admin_id_key" ON "notification_reads"("notification_id", "admin_id");

-- CreateIndex
CREATE INDEX "broadcast_notifications_tenant_id_idx" ON "broadcast_notifications"("tenant_id");

-- CreateIndex
CREATE INDEX "broadcast_notifications_created_at_idx" ON "broadcast_notifications"("created_at");

-- CreateIndex
CREATE INDEX "broadcast_notifications_target_idx" ON "broadcast_notifications"("target");

-- CreateIndex
CREATE INDEX "broadcast_notifications_status_idx" ON "broadcast_notifications"("status");

-- AddForeignKey
ALTER TABLE "broadcast_notifications" ADD CONSTRAINT "broadcast_notifications_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_reads" ADD CONSTRAINT "notification_reads_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "super_admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
