import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
} from '@grafana/data';
import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import { map } from 'rxjs/operators';
import { STAService } from 'util/STAService';

import { DataSourceOptions, emptyFrame, RequestFunctions, StaQuery } from './types';

export class DataSource extends DataSourceApi<StaQuery, DataSourceOptions> {

  staService: STAService;
  url: string;

  constructor(instanceSettings: DataSourceInstanceSettings<DataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url === undefined ? '' : instanceSettings.url;
    this.staService = new STAService(this.url);
  }

  async query(options: DataQueryRequest<StaQuery>): Promise<DataQueryResponse> {

    const from = options.range.from.toISOString();
    const to = options.range.to.toISOString();

    const promises: Promise<MutableDataFrame<any>>[] = options.targets.map(query => {
      let arg1 = '';
      if (query.requestArgs?.length > 0) {
        arg1 = getTemplateSrv().replace(query.requestArgs[0]);
      }
      // Start multiplexing here
      switch (query.requestFunction!) {
        case RequestFunctions.getDatastreams: {
          return this.staService.getDatastreams().toPromise();
        }

        case RequestFunctions.getDatastream: {
          return this.staService.getDatastream(arg1).toPromise();
        }

        case RequestFunctions.getObservationsByDatastreamId: {
          return this.staService.getDatastream(arg1).toPromise().then(result => {
            return this.staService.getObservationsByDatastreamId(arg1, result.get(0)['unit'], from, to).toPromise();
          });
        }

        case RequestFunctions.getSensorByDatastreamId: {
          console.log('getSensorByDatastreamId');
          return this.staService.getSensorByDatastreamId(arg1);
        }
        case RequestFunctions.getObservedPropertyByDatastreamId: {
          console.log('getObservedPropertyByDatastreamId');
          return this.staService.getObservedPropertyByDatastreamId(arg1);
        }
        default: {
          console.log('Default empty');
          console.log(query.requestFunction);
          return new Promise<MutableDataFrame>(resolve => {
            resolve(emptyFrame);
          });
        }
      }
    });

    return Promise.all(promises).then(data => ({ data }));
  }

  /**
   * Health check for data source
   * @returns {Promise<any>}
   */
  async testDatasource(): Promise<any> {
    return getBackendSrv().fetch<any>({ url: this.url }).pipe(
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
              }
            }
          }
        }
        return {
          status: 'error',
          message: `Error while checking datasource. Got HTTP Status: ${res.status}. (Possible problems are a forgotten trailing slash)`,
          title: 'Error',
        };
      })
    ).toPromise();
  }
}
