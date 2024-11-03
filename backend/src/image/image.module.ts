import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImagesController } from "./images.controller";

@Module({
  controllers: [ImagesController],
  providers: [ImageService],
})
export class ImageModule {}
