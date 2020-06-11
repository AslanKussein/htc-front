import {Period} from "./common/period";

export class ObjectFilterDto {
  constructor(
    public pageNumber?: number,
    public pageSize?: number,
    public districtId?: number,
    public materialOfConstructionId?: number,
    public residentialComplexId?: any,
    public objectTypeId?: any,
    public apartmentNumber?: number,
    public encumbrance?: boolean,
    public price?: Period,
    public floor?: Period,
    public floorInTheHouse?: Period,
    public totalArea?: Period,
    public livingArea?: Period,
    public kitchenArea?: Period,
    public numberOfRooms?: number,
    public my?: boolean,
  ) {
  }

}
