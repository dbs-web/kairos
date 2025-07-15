/*
  Warnings:

  - You are about to drop the column `briefing` on the `Suggestion` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Suggestion` table. All the data in the column will be lost.
  - Added the required column `name_profile` to the `Suggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_text` to the `Suggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_url` to the `Suggestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialmedia_name` to the `Suggestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Suggestion` DROP COLUMN `briefing`,
    DROP COLUMN `title`,
    ADD COLUMN `name_profile` VARCHAR(191) NOT NULL,
    ADD COLUMN `post_image` VARCHAR(191) NULL,
    ADD COLUMN `post_text` TEXT NOT NULL,
    ADD COLUMN `post_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `socialmedia_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_photo` VARCHAR(191) NULL;

-- RenameIndex
ALTER TABLE `Suggestion` RENAME INDEX `Suggestion_userId_fkey` TO `Suggestion_userId_idx`;
