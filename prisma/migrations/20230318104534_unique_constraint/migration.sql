/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Media` MODIFY `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX `Media_url_key` ON `Media`(`url`);
