import {DBConfig} from 'ngx-indexed-db';
export const dbConfig: DBConfig  = {
  name: 'dicData7',
  version: 3,
  objectStoresMeta: [
    {
      store: 'operation_types',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'object_types',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'cities',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'districts',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'parking_types',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'streets',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'possible_reasons_for_bidding',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'countries',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'materials_of_construction',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'yes_no',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'type_of_elevator',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'yard_types',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'property_developers',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'sewerage_systems',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'heating_systems',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'application_statuses',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'residentialComplexes',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'event_types',
      storeConfig: { keyPath: 'value', autoIncrement: true },
      storeSchema: []
    }
  ],
};
