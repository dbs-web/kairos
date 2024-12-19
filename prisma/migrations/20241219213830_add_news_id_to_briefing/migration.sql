-- DropForeignKey
ALTER TABLE `Briefing` DROP FOREIGN KEY `Briefing_suggestionId_fkey`;

-- AlterTable
ALTER TABLE `Briefing` ADD COLUMN `newsId` INTEGER NULL,
    MODIFY `suggestionId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Briefing_newsId_fkey` ON `Briefing`(`newsId`);

-- AddForeignKey
ALTER TABLE `Briefing` ADD CONSTRAINT `Briefing_suggestionId_fkey` FOREIGN KEY (`suggestionId`) REFERENCES `Suggestion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Briefing` ADD CONSTRAINT `Briefing_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
