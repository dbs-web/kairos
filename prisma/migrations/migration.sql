-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `avatarGroupId` VARCHAR(191) NOT NULL,
    `voiceId` VARCHAR(191) NULL,
    `difyAgent` VARCHAR(191) NULL,
    `difyContentCreation` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Suggestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(500) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `briefing` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` ENUM('EM_ANALISE', 'EM_PRODUCAO', 'PRODUZIDO', 'APROVADO', 'ARQUIVADO') NOT NULL DEFAULT 'EM_ANALISE',

    INDEX `Suggestion_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Briefing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `suggestionId` INTEGER NULL,
    `title` VARCHAR(500) NOT NULL,
    `text` VARCHAR(5000) NULL,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('EM_ANALISE', 'EM_PRODUCAO', 'PRODUZIDO', 'APROVADO', 'ARQUIVADO') NOT NULL,
    `userId` INTEGER NOT NULL,
    `newsId` INTEGER NULL,
    `sources` JSON NULL,

    INDEX `Briefing_suggestionId_fkey`(`suggestionId`),
    INDEX `Briefing_newsId_fkey`(`newsId`),
    INDEX `Briefing_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(500) NOT NULL,
    `summary` VARCHAR(1000) NOT NULL,
    `userId` INTEGER NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `thumbnail` VARCHAR(500) NOT NULL,
    `status` ENUM('EM_ANALISE', 'EM_PRODUCAO', 'PRODUZIDO', 'APROVADO', 'ARQUIVADO') NOT NULL,
    `text` VARCHAR(5000) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `News_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `legenda` VARCHAR(2000) NOT NULL,
    `url` VARCHAR(500) NULL,
    `heygenErrorMsg` VARCHAR(191) NULL,
    `heygenStatus` ENUM('PROCESSING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PROCESSING',
    `heygenVideoId` VARCHAR(191) NULL,
    `height` INTEGER NOT NULL,
    `width` INTEGER NOT NULL,
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `transcription` VARCHAR(2000) NOT NULL DEFAULT '',

    UNIQUE INDEX `Video_heygenVideoId_key`(`heygenVideoId`),
    INDEX `Video_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `route` VARCHAR(500) NOT NULL,
    `body` JSON NULL,
    `error` VARCHAR(1000) NULL,
    `responseCode` INTEGER NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Suggestion` ADD CONSTRAINT `Suggestion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Briefing` ADD CONSTRAINT `Briefing_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Briefing` ADD CONSTRAINT `Briefing_suggestionId_fkey` FOREIGN KEY (`suggestionId`) REFERENCES `Suggestion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Briefing` ADD CONSTRAINT `Briefing_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

