export class PatchDeckDto {
  action: "moveZone" | "replaceCard";
  cardId: string;
  originZone?: string;
  destinationZone?: string;
  oldId?: string;
  newId?: string;
}
