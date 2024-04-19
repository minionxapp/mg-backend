-- CreateTable
CREATE TABLE `pegawais` (
    `nik` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `alamat` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`nik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
