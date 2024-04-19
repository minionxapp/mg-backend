-- CreateTable
CREATE TABLE `Tables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaTable` VARCHAR(100) NOT NULL,
    `namaKolom` VARCHAR(100) NOT NULL,
    `tipe` VARCHAR(100) NOT NULL,
    `panjang` INTEGER NOT NULL,
    `notNull` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `createRequest` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `createResponseSukses` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `updateRequest` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `updateResponseSukses` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `getRequest` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `getResponse` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `searchRequest` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `searchResponse` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `removeRequest` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `removeResponse` VARCHAR(2) NOT NULL DEFAULT 'Y',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
