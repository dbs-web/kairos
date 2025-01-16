-- AlterTable
ALTER TABLE `Briefing` MODIFY `title` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `News` MODIFY `title` VARCHAR(500) NOT NULL,
    MODIFY `summary` VARCHAR(1000) NOT NULL,
    MODIFY `url` VARCHAR(500) NOT NULL,
    MODIFY `thumbnail` VARCHAR(500) NOT NULL,
    MODIFY `text` VARCHAR(5000) NOT NULL;

-- AlterTable
ALTER TABLE `Suggestion` MODIFY `title` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `Video` ADD COLUMN `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `title` VARCHAR(500) NOT NULL,
    MODIFY `legenda` VARCHAR(2000) NOT NULL,
    MODIFY `url` VARCHAR(500) NULL;
