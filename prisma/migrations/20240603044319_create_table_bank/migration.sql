/*
  Warnings:

  - Made the column `alamat` on table `persons` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nik` on table `persons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `persons` MODIFY `alamat` VARCHAR(250) NOT NULL,
    MODIFY `nik` VARCHAR(10) NOT NULL;

-- CreateTable
CREATE TABLE `banks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(4) NOT NULL,
    `nama` VARCHAR(50) NOT NULL,
    `jenis` VARCHAR(20) NOT NULL,
    `status` VARCHAR(2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createBy` VARCHAR(20) NULL,
    `updateBy` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
