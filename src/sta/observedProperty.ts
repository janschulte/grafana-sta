import { FieldType, MutableDataFrame } from '@grafana/data';

import { StaEntity, StaGrafanaParser } from './common';

export interface ObservedProperty {
    id: string;
    name?: string;
    definition?: string;
    raw: object;
}

export interface StaObservedProperty extends StaEntity {
    name: string;
    definition: string;
}

export class ObservedPropertyParser extends StaGrafanaParser<StaObservedProperty, MutableDataFrame<ObservedProperty>> {

    constructor() {
        super(
            new MutableDataFrame({
                fields: [
                    { name: 'id', type: FieldType.string },
                    { name: 'name', type: FieldType.string },
                    { name: 'definition', type: FieldType.string },
                    { name: 'raw', type: FieldType.other },
                ],
            })
        )
    }

    protected parseElemAndAdd(elem: StaObservedProperty): void {
        const obsProp: ObservedProperty = {
            id: elem['@iot.id'],
            raw: elem
        }
        obsProp.name = elem.name;
        obsProp.definition = elem.definition;
        this.frame.add(obsProp);
    }
}