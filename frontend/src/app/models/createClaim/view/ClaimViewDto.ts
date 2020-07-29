import {Period} from "../../common/period";

export class ClaimViewDto {
  public id: number;
  public clientLogin: string;
  public agent: string;
  public operationType: any;
  public objectType: any;
  public objectPrice: number;
  public objectPricePeriod: Period;
  public applicationFlagIdList: any;
  public probabilityOfBidding: boolean = false;
  public mortgage: boolean = false;
  public isSell: boolean = false;
  public isFlat: boolean = false;
  public encumbrance: boolean = false;
  public sharedOwnershipProperty: boolean = false;
  public exchange: boolean = false;
  public possibleReasonForBiddingIdList: any;
  public theSizeOfTrades: number;
  public comment: string;
  public numberOfRoomsPeriod: Period;
  public landAreaPeriod: Period;
  public numberOfRooms: number;
  public landArea: number;
  public floorPeriod: Period;
  public floor: number;
  public totalAreaPeriod: Period;
  public totalArea: number;
  public livingAreaPeriod: Period;
  public livingArea: number;
  public kitchenAreaPeriod: Period;
  public kitchenArea: number;
  public balconyAreaPeriod: Period;
  public balconyArea: number;
  public ceilingHeightPeriod: Period;
  public ceilingHeight: number;
  public numberOfBedroomsPeriod: Period;
  public numberOfFloorsPeriod: Period;
  public yearOfConstructionPeriod: Period;
  public apartmentsOnTheSitePeriod: Period;
  public numberOfBedrooms: number;
  public atelier: boolean = false;
  public separateBathroom: boolean = false;
  public districts: any;
  public numberOfFloors: number;
  public apartmentsOnTheSite: string;
  public materialOfConstruction: any;
  public yearOfConstruction: number;
  public typeOfElevatorList: any;
  public concierge: boolean = false;
  public wheelchair: boolean = false;
  public yardType: any;
  public parkingTypes: any;
  public playground: boolean = false;
  public city: any;
  public street: any;
  public fullAddress: string;
  public residenceComplex: string;
  public apartmentNumber: string;
  public houseNumber: string;
  public photoIdList: any;
  public housingPlanImageIdList: any;
  public virtualTourImageIdList: any;
  public description: string;
  public houseCondition: any;
  public heatingSystem: any;
  public sewerage: any;
  public operationList: any;
  public housingClass: any;
  public latitude: any;
  public longitude: any;
  public postcode: any;
}
