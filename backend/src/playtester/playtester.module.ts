import { Module } from "@nestjs/common";
import { EventsGateway } from "./playtester.gateway";
import { PlaytesterService } from './playtester.service';

@Module({
  providers: [EventsGateway, PlaytesterService],
})
export class EventsModule {}
