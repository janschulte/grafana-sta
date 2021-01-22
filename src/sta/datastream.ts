import { FieldType, MutableDataFrame } from '@grafana/data';

import { StaEntity, StaGrafanaParser } from './common';

interface GrafanaDatastream {
    id: string;
    minPhenomenonTime?: number;
    maxPhenomenonTime?: number;
    unit?: string;
}

export interface StaDatastream extends StaEntity {
    unitOfMeasurement?: {
        name: string;
        symbol: string;
        definition: string;
    };
    phenomenonTime?: string;
}

export interface DatastreamFrame extends MutableDataFrame<GrafanaDatastream> { }

export class DatastreamParser extends StaGrafanaParser<StaDatastream, DatastreamFrame> {

    constructor() {
        super(
            new MutableDataFrame({
                fields: [
                    { name: 'id', type: FieldType.string },
                    // { name: 'phenomenonTime', type: FieldType.string },
                    // { name: 'geometry', type: FieldType.other },
                    { name: 'minPhenomenonTime', type: FieldType.time },
                    { name: 'maxPhenomenonTime', type: FieldType.time },
                    { name: 'unit', type: FieldType.string },
                ],
            })
        );
    }

    protected parseElemAndAdd(elem: StaDatastream): void {
        const ds: GrafanaDatastream = {
            id: elem['@iot.id']
        }
        ds.unit = elem.unitOfMeasurement?.symbol;
        if (elem.phenomenonTime !== undefined) {
            const split = elem.phenomenonTime.split('/');
            ds.minPhenomenonTime = Date.parse(split[0]);
            ds.maxPhenomenonTime = Date.parse(split[1]);
        }
        this.frame.add(ds);
    }
}