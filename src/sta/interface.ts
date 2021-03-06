import { MutableDataFrame } from '@grafana/data';
import { BackendSrvRequest, getBackendSrv } from '@grafana/runtime';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { StaEntity, StaGrafanaParser, StaValueListResponse } from './common';
import { Datastream, DatastreamParser, StaDatastream } from './datastream';
import { ObservationParser } from './observation';
import { ObservedProperty, ObservedPropertyParser, StaObservedProperty } from './observedProperty';
import { Sensor, SensorParser, StaSensor } from './sensor';
import { Thing, ThingParser } from './thing';

export class StaInterface {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  getDatastreams(): Observable<MutableDataFrame<Datastream>> {
    return this.page(this.url + 'Datastreams', new DatastreamParser());
  }

  getDatastream(datastreamId: string): Observable<MutableDataFrame<Datastream>> {
    return this.fetch<StaDatastream>({ url: `${this.url}Datastreams(${datastreamId})` }).pipe(
      map(res => new DatastreamParser().parseEntity(res).getFrame())
    );
  }

  getObservationsByDatastreamId(
    datastreamId: string,
    unit: string,
    from?: string,
    to?: string
  ): Observable<MutableDataFrame> {
    const timeFilter = this.createTimefilter(from, to);
    const params = [];
    if (timeFilter) {
      params.push(`$filter=${timeFilter}`);
    }
    params.push('$top=1000');
    params.push('$orderby=phenomenonTime asc');
    const url = `${this.url}Datastreams(${datastreamId})/Observations?${params.join('&')}`;
    const parser = new ObservationParser(unit);
    return this.page(url, parser);
  }

  getSensorByDatastreamId(datastreamId: string): Observable<MutableDataFrame<Sensor>> {
    return this.fetch<StaSensor>({ url: `${this.url}Datastreams(${datastreamId})/Sensor` }).pipe(
      map(res => new SensorParser().parseEntity(res).getFrame())
    );
  }

  getObservedPropertyByDatastreamId(datastreamId: string): Observable<MutableDataFrame<ObservedProperty>> {
    return this.fetch<StaObservedProperty>({ url: `${this.url}Datastreams(${datastreamId})/ObservedProperty` }).pipe(
      map(res => new ObservedPropertyParser().parseEntity(res).getFrame())
    );
  }

  getThings(): Observable<MutableDataFrame<Thing>> {
    return this.page(this.url + 'Things', new ThingParser());
  }

  private createTimefilter(from: string | undefined, to: string | undefined) {
    const filters = [];
    if (from) {
      filters.push(`phenomenonTime ge ${from}`);
    }
    if (to) {
      filters.push(`phenomenonTime le ${to}`);
    }
    return filters.length ? filters.join(' and ') : null;
  }

  page<T extends StaEntity, U extends MutableDataFrame>(
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
    );
  }

  fetch<T>(options?: BackendSrvRequest): Observable<T> {
    if (!options) {
      options = { url: this.url };
    }
    options.method = 'GET';
    return getBackendSrv()
      .fetch<T>(options)
      .pipe(map(res => res.data));
  }
}
