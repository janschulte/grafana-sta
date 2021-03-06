import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
  MutableDataFrame,
} from '@grafana/data';
import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StaInterface } from 'sta/interface';

import { DataSourceOptions, RequestFunctions, StaQuery } from './types';
import { MyVariableQuery, VariableQueryType } from './VariableQueryEditor';

export class DataSource extends DataSourceApi<StaQuery, DataSourceOptions> {
  sta: StaInterface;
  url: string;

  constructor(instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url === undefined ? '' : instanceSettings.url;
    this.sta = new StaInterface(this.url);
  }

  async query(options: DataQueryRequest<StaQuery>): Promise<DataQueryResponse> {
    const from = options.range.from.toISOString();
    const to = options.range.to.toISOString();

    const observables: Array<Observable<MutableDataFrame<any>>> = options.targets.map(query => {
      let arg1 = '';
      if (query.requestArgs?.length > 0) {
        arg1 = getTemplateSrv().replace(query.requestArgs[0]);
      }
      // Start multiplexing here
      switch (query.requestFunction!) {
        case RequestFunctions.Datastreams: {
          return this.sta.getDatastreams();
        }

        case RequestFunctions.Datastream: {
          return this.sta.getDatastream(arg1);
        }

        case RequestFunctions.ObservationsByDatastreamId: {
          return this.sta
            .getDatastream(arg1)
            .pipe(switchMap(res => this.sta.getObservationsByDatastreamId(arg1, res.get(0).unit || '', from, to)));
        }

        case RequestFunctions.SensorByDatastreamId: {
          return this.sta.getSensorByDatastreamId(arg1);
        }

        case RequestFunctions.ObservedPropertyByDatastreamId: {
          return this.sta.getObservedPropertyByDatastreamId(arg1);
        }

        case RequestFunctions.Things: {
          return this.sta.getThings();
        }

        default: {
          return of(new MutableDataFrame({ fields: [] }));
        }
      }
    });

    return forkJoin(observables)
      .toPromise()
      .then(data => ({ data }));
  }

  /**
   * Health check for data source
   * @returns {Promise<any>}
   */
  async testDatasource(): Promise<any> {
    return getBackendSrv()
      .fetch<any>({ url: this.url })
      .pipe(
        map(res => {
          if (res.status === 200 && res.data && res.data.value && res.data.value) {
            const value = res.data.value;
            if (value instanceof Array) {
              const dsValue = value.find(e => e.name === 'Datastreams');
              if (dsValue) {
                return {
                  status: 'success',
                  message: 'Successfully checked connection to STA',
                  title: 'Success',
                };
              }
            }
          }
          return {
            status: 'error',
            message: `Error while checking datasource. Got HTTP Status: ${res.status}. (Possible problems are a forgotten trailing slash)`,
            title: 'Error',
          };
        })
      )
      .toPromise();
  }

  async metricFindQuery(query: MyVariableQuery, options?: any): Promise<MetricFindValue[]> {
    console.log(`Selected type: ${query.queryType}`);

    if (query.queryType === VariableQueryType.Datastream) {
      const datastreams = await this.sta.getDatastreams().toPromise();
      return datastreams.map(e => ({ text: e.id }));
    }
    return [];
  }
}
