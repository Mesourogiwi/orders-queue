/*
  Warnings:

  - Added the required column `orderStatus` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `orderStatus` ENUM('PENDING_PAYMENT', 'APPROVED', 'IN_SEPARATION', 'IN_TRANSPORTATION', 'DELIVERED', 'CANCELED') NOT NULL;
