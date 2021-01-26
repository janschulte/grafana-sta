import { DataQuery, DataSourceJsonData } from '@grafana/data';

export enum RequestFunctions {
  Datastreams = 'Datastreams',
  Datastream = 'Datastream',
  ObservedPropertyByDatastreamId = 'ObservedPropertyByDatastreamId',
  ObservationsByDatastreamId = 'ObservationsByDatastreamId',
  SensorByDatastreamId = 'SensorByDatastreamId',
  Things = 'Things',
}

export interface StaQuery extends DataQuery {
  requestFunction: RequestFunctions;
  requestArgs: string[];
}

export interface DataSourceOptions extends DataSourceJsonData { }