/*
  Warnings:

  - You are about to alter the column `type` on the `Media` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Media` MODIFY `type` ENUM('IMAGE', 'AUDIO', 'VIDEO') NULL,
    MODIFY `url` VARCHAR(191) NULL;
