import { DataQuery, DataSourceJsonData, FieldType, MutableDataFrame } from '@grafana/data';

export enum RequestFunctions {
  'getDatastreams',
  'getDatastream',
  'getObservedPropertyByDatastreamId',
  'getObservationsByDatastreamId',
  'getSensorByDatastreamId',
  'getObservationsByCustom',
}

export interface StaQuery extends DataQuery {
  requestFunction: RequestFunctions;
  requestArgs: string[];
}

export const defaultQuery: Partial<StaQuery> = {
  requestArgs: [],
};

export interface MyVariableQuery {}

/**
 * These are options configured for each DataSource instance
 */
export interface DataSourceOptions extends DataSourceJsonData {}

export const emptyFrame = new MutableDataFrame({
  fields: [],
});

export interface ThingFrame extends MutableDataFrame {}
export function thingFrame(): ThingFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'name', type: FieldType.string },
    ],
  });
}

export interface SensorFrame extends MutableDataFrame {}
export function sensorFrame(): SensorFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'name', type: FieldType.string },
      { name: 'description', type: FieldType.string },
      { name: 'raw', type: FieldType.other },
    ],
  });
}

export interface ObservedPropertyFrame extends MutableDataFrame {}
export function observedPropertyFrame(): ObservedPropertyFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'name', type: FieldType.string },
      { name: 'definition', type: FieldType.string },
      { name: 'raw', type: FieldType.other },
    ],
  });
}

export interface FeatureOfInterestFrame extends MutableDataFrame {}
export function foiFrame(): FeatureOfInterestFrame {
  return new MutableDataFrame({
    fields: [
      { name: 'id', type: FieldType.string },
      { name: 'name', type: FieldType.string },
      { name: 'latitude', type: FieldType.number },
      { name: 'longitude', type: FieldType.number },
    ],
  });
}
