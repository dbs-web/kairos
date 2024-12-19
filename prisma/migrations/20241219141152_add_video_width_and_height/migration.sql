/*
  Warnings:

  - Added the required column `height` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Briefing` MODIFY `status` ENUM('EM_ANALISE', 'EM_PRODUCAO', 'PRODUZIDO', 'APROVADO', 'ARQUIVADO') NOT NULL;

-- AlterTable
ALTER TABLE `News` MODIFY `status` ENUM('EM_ANALISE', 'EM_PRODUCAO', 'PRODUZIDO', 'APROVADO', 'ARQUIVADO') NOT NULL;

-- AlterTable
ALTER TABLE `Suggestion` MODIFY `status` ENUM('EM_ANALISE', 'EM_PRODUCAO', 'PRODUZIDO', 'APROVADO', 'ARQUIVADO') NOT NULL DEFAULT 'EM_ANALISE';

-- AlterTable
ALTER TABLE `Video` ADD COLUMN `height` INTEGER NOT NULL,
    ADD COLUMN `width` INTEGER NOT NULL;
