/*
  Warnings:

  - You are about to drop the column `message` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "message",
DROP COLUMN "type",
ADD COLUMN     "imageId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
