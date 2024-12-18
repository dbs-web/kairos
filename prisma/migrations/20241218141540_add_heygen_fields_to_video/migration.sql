/*
  Warnings:

  - A unique constraint covering the columns `[heygenVideoId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Video` ADD COLUMN `heygenErrorMsg` VARCHAR(191) NULL,
    ADD COLUMN `heygenStatus` ENUM('PROCESSING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PROCESSING',
    ADD COLUMN `heygenVideoId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Video_heygenVideoId_key` ON `Video`(`heygenVideoId`);
