import { FieldType, MutableDataFrame } from '@grafana/data';

import { StaEntity, StaGrafanaParser } from './common';

interface GrafanaObservation {
    id: string;
    value?: number;
    time?: number;
}

export interface StaObservation extends StaEntity {
    result: string;
    phenomenonTime: string;
}

export interface ObservationFrame extends MutableDataFrame { }

export class ObservationParser extends StaGrafanaParser<StaObservation, ObservationFrame> {

    constructor(unit: string) {
        super(new MutableDataFrame({
            fields: [
                { name: 'id', type: FieldType.string },
                { name: 'value', type: FieldType.number, config: { unit: unit } },
                { name: 'time', type: FieldType.time },
            ],
        }));
    }

    protected parseElemAndAdd(elem: StaObservation): void {
        const obs: GrafanaObservation = { id: elem['@iot.id'] };

        const time = Date.parse(elem.phenomenonTime);
        if (time) { obs.time = time; }

        const value = Number.parseFloat(elem.result);
        if (value) { obs.value = value; }
        this.frame.add(obs);
    }

}