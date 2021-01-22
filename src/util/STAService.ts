import { MutableDataFrame } from '@grafana/data';
import { BackendSrvRequest, getBackendSrv } from '@grafana/runtime';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { observedPropertyFrame, sensorFrame } from 'types';

import { StaEntity, StaGrafanaParser, StaValueListResponse } from '../sta/common';
import { StaDatastream } from '../sta/datastream';
import { ObservationParser } from '../sta/observations';
import { DatastreamParser } from './../sta/datastream';
import { parseIntoObservedPropertyFrame, parseIntoSensorFrame } from './ResponseTransform';

export class STAService {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public getDatastreams(): Observable<MutableDataFrame> {
    const parser = new DatastreamParser();
    return this.fetch<StaValueListResponse<StaDatastream>>({ url: this.url + 'Datastreams' }).pipe(
      map(res => parser.parseList(res).getFrame())
    );
  }

  public getDatastream(datastreamId: string): Observable<MutableDataFrame> {
    const url = this.url + "Datastreams(" + datastreamId + ")"
    const parser = new DatastreamParser();
    return this.fetch<StaDatastream>({ url }).pipe(
      map(res => parser.parseEntity(res).getFrame())
    )
  }

  async getSensorByDatastreamId(datastreamId: string): Promise<MutableDataFrame> {
    return this.getPaginated(
      this.url + "Datastreams('" + datastreamId + "')/Sensor",
      sensorFrame(),
      parseIntoSensorFrame
    );
  }

  async getObservedPropertyByDatastreamId(datastreamId: string): Promise<MutableDataFrame> {
    return this.getPaginated(
      this.url + "Datastreams(" + datastreamId + ")/ObservedProperty",
      observedPropertyFrame(),
      parseIntoObservedPropertyFrame
    );
  }

  public getObservationsByDatastreamId(
    datastreamId: string,
    unit: string,
    from?: string,
    to?: string,
  ): Observable<MutableDataFrame> {
    const timeFilter = this.createTimefilter(from, to);
    const params = [];
    if (timeFilter) {
      params.push(`$filter=${timeFilter}`);
    }
    params.push('$top=1000')
    params.push('$orderby=phenomenonTime asc');
    const url = `${this.url}Datastreams(${datastreamId})/Observations?${params.join('&')}`;
    const parser = new ObservationParser(unit);
    return this.page(url, parser);
  }

  private createTimefilter(from: string | undefined, to: string | undefined) {
    const filters = [];
    if (from) {
      filters.push(`phenomenonTime ge ${from}`);
    }
    if (to) {
      filters.push(`phenomenonTime le ${to}`);
    }
    return filters.length ? filters.join(' and ') : null
  }

  async getPaginated(url: string, frame: MutableDataFrame, responseParser: Function): Promise<MutableDataFrame> {
    return this.doGET({
      url: url,
    }).then(response => {
      // Parse values from this page into frame
      responseParser(frame, response);
      // Check if there are additional pages
      if ('@iot.nextLink' in response) {
        // Request next page recursively
        return this.getPaginated(response['@iot.nextLink'], frame, responseParser);
      } else {
        return frame;
      }
    });
  }

  // TODO: replace with fetch Method
  async doGET(options: any) {
    options!.method = 'GET';
    if (!('url' in options)) {
      options.url = this.url;
    }
    return await getBackendSrv().request(options);
  }

  public page<T extends StaEntity, U extends MutableDataFrame>(
    url: string,
    parser: StaGrafanaParser<T, U>
  ): Observable<MutableDataFrame> {
    return this.fetch<StaValueListResponse<T>>({ url }).pipe(
      switchMap(res => {
        parser.parseList(res);
        if (res['@iot.nextLink']) {
          return this.page(res['@iot.nextLink'], parser);
        } else {
          return of(parser.getFrame());
        }
      })
    )
  }

  public fetch<T>(options?: BackendSrvRequest): Observable<T> {
    if (!options) {
      options = { url: this.url }
    }
    options.method = 'GET';
    return getBackendSrv().fetch<T>(options).pipe(map(res => res.data))
  }
}
