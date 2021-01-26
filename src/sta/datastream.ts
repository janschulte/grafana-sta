import { FieldType, MutableDataFrame } from '@grafana/data';

import { StaEntity, StaGrafanaParser } from './common';

export interface Datastream {
    id: string;
    name?: string;
    minPhenomenonTime?: number;
    maxPhenomenonTime?: number;
    unit?: string;
}

export interface StaDatastream extends StaEntity {
    name?: string;
    unitOfMeasurement?: {
        name: string;
        symbol: string;
        definition: string;
    };
    phenomenonTime?: string;
}

export class DatastreamParser extends StaGrafanaParser<StaDatastream, MutableDataFrame<Datastream>> {

    constructor() {
        super(
            new MutableDataFrame({
                fields: [
                    { name: 'id', type: FieldType.string },
                    { name: 'name', type: FieldType.string },
                    // { name: 'geometry', type: FieldType.other },
                    { name: 'minPhenomenonTime', type: FieldType.time },
                    { name: 'maxPhenomenonTime', type: FieldType.time },
                    { name: 'unit', type: FieldType.string },
                ],
            })
        );
    }

    protected parseElemAndAdd(elem: StaDatastream): void {
        const datastream: Datastream = {
            id: elem['@iot.id'],
        }
        datastream.name = elem.name;
        datastream.unit = elem.unitOfMeasurement?.symbol;
        if (elem.phenomenonTime !== undefined) {
            const split = elem.phenomenonTime.split('/');
            datastream.minPhenomenonTime = Date.parse(split[0]);
            datastream.maxPhenomenonTime = Date.parse(split[1]);
        }
        this.frame.add(datastream);
    }
}