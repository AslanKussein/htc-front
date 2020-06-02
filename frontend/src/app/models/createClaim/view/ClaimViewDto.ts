import {Period} from "../../common/period";

export class ClaimViewDto {
  private id: number;
  private clientLogin: string;
  private agent: string;
  private operationType: any;
  private objectType: any;
  private objectPrice: number;
  private objectPricePeriod: Period;
  private applicationFlagIdList: any;
  private probabilityOfBidding: boolean;
  private possibleReasonForBiddingIdList: any;
  private theSizeOfTrades: number;
  private comment: string;
  private numberOfRoomsPeriod: Period;
  private numberOfRooms: number;
  private floorPeriod: Period;
  private floor: number;
  private totalAreaPeriod: Period;
  private totalArea: number;
  private livingAreaPeriod: Period;
  private livingArea: number;
  private kitchenAreaPeriod: Period;
  private kitchenArea: number;
  private balconyAreaPeriod: Period;
  private balconyArea: number;
  private ceilingHeightPeriod: Period;
  private ceilingHeight: number;
  private numberOfBedroomsPeriod: Period;
  private numberOfBedrooms: number;
  private atelier: boolean;
  private separateBathroom: boolean;
  private district: any;
  private numberOfFloors: number;
  private apartmentsOnTheSite: string;
  private materialOfConstruction: any;
  private yearOfConstruction: number;
  private typeOfElevatorList: any;
  private concierge: boolean;
  private wheelchair: boolean;
  private yardType: any;
  private playground: boolean;
}
