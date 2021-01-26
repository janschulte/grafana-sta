import { DataQuery, DataSourceJsonData } from '@grafana/data';

export enum RequestFunctions {
  'getDatastreams',
  'getDatastream',
  'getObservedPropertyByDatastreamId',
  'getObservationsByDatastreamId',
  'getSensorByDatastreamId',
  'getObservationsByCustom',
  'Things'
}

export interface StaQuery extends DataQuery {
  requestFunction: RequestFunctions;
  requestArgs: string[];
}

export interface DataSourceOptions extends DataSourceJsonData { }
