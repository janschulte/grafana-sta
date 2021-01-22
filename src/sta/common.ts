import { MutableDataFrame } from '@grafana/data';

export interface StaEntity {
    '@iot.id': string;
    '@iot.selfLink': string;
}

export interface StaValueListResponse<T extends StaEntity> {
    '@iot.count': number;
    '@iot.nextLink': string;
    value: T[];
}

export abstract class StaGrafanaParser<T extends StaEntity, U extends MutableDataFrame> {

    protected frame: U;

    constructor(horst: U) {
        this.frame = horst;
    }

    public parseList(entityList: StaValueListResponse<T>): StaGrafanaParser<T, U> {
        entityList.value.forEach(elem => this.parseElemAndAdd(elem));
        return this;
    };

    public parseEntity(entity: T): StaGrafanaParser<T, U> {
        this.parseElemAndAdd(entity);
        return this;
    };

    public getFrame(): U {
        return this.frame;
    };

    protected abstract parseElemAndAdd(elem: T): void;

}