import { FieldType, MutableDataFrame } from '@grafana/data';

import { StaEntity, StaGrafanaParser } from './common';

export interface Thing {
    id: string;
    name?: string;
    description?: string;
    raw: object;
}

export interface StaThing extends StaEntity {
    name: string;
    description: string;
}

export class ThingParser extends StaGrafanaParser<StaThing, MutableDataFrame<Thing>> {

    constructor() {
        super(
            new MutableDataFrame({
                fields: [
                    { name: 'id', type: FieldType.string },
                    { name: 'name', type: FieldType.string },
                    { name: 'description', type: FieldType.string },
                    { name: 'raw', type: FieldType.other },
                ],
            })
        )
    }

    protected parseElemAndAdd(elem: StaThing): void {
        const thing: Thing = {
            id: elem['@iot.id'],
            raw: elem
        }
        thing.name = elem.name;
        thing.description = elem.description;
        this.frame.add(thing);
    }
}