/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Site` ADD COLUMN `tokenId` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Token`;
