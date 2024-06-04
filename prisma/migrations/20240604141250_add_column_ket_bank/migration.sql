/*
  Warnings:

  - Added the required column `keterangan` to the `banks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `banks` ADD COLUMN `keterangan` VARCHAR(250) NOT NULL;
