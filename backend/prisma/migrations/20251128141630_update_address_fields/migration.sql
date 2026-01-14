/*
  Warnings:

  - You are about to drop the column `street` on the `address` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `street`,
    ADD COLUMN `addressLine1` VARCHAR(191) NOT NULL,
    ADD COLUMN `addressLine2` VARCHAR(191) NULL;
