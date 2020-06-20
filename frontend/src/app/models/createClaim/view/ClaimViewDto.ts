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
  public probabilityOfBidding: boolean;
  public mortgage: boolean;
  public isSell: boolean;
  public encumbrance: boolean;
  public sharedOwnershipProperty: boolean;
  public exchange: boolean;
  public possibleReasonForBiddingIdList: any;
  public theSizeOfTrades: number;
  public comment: string;
  public numberOfRoomsPeriod: Period;
  public numberOfRooms: number;
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
  public numberOfBedrooms: number;
  public atelier: boolean;
  public separateBathroom: boolean;
  public district: any;
  public numberOfFloors: number;
  public apartmentsOnTheSite: string;
  public materialOfConstruction: any;
  public yearOfConstruction: number;
  public typeOfElevatorList: any;
  public concierge: boolean;
  public wheelchair: boolean;
  public yardType: any;
  public parkingTypes: any;
  public playground: boolean;
  public city: any;
  public street: any;
  public fullAddress: string;
  public residenceComplex: string;
  public apartmentNumber: string;
  public photoIdList: any;
  public housingPlanImageIdList: any;
  public virtualTourImageIdList: any;
  public description: string;
}
