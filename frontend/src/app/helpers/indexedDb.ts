import {DBConfig} from 'ngx-indexed-db';
export const dbConfig: DBConfig  = {
  name: 'dicDataDb3',
  version: 3,
  objectStoresMeta: [
    {
      store: 'OperationType',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'ObjectType',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'City',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'District',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'ParkingType',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'Street',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'PossibleReasonForBidding',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'Country',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'MaterialOfConstruction',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'YES_NO',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'TypeOfElevator',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'YardType',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'PropertyDeveloper',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'Sewerage',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'HeatingSystem',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'ApplicationStatus',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'residentialComplexes',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'EventType',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    }
  ],
};
