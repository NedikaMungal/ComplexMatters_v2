import { UnitType } from "./unittype";
  export interface Unit {
    unitId: number
    complexId: number
    unitNumber: string
    unitTypeId: number
    unitType?: UnitType
    ownerCount?: number 
  }

