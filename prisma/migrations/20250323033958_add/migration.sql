/*
  Warnings:

  - Added the required column `itemQuantity` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderItems` ADD COLUMN `itemQuantity` INTEGER NOT NULL;
