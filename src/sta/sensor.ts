import { FieldType, MutableDataFrame } from '@grafana/data';

import { StaEntity, StaGrafanaParser } from './common';

export interface Sensor {
  id: string;
  name?: string;
  description?: string;
  raw: object;
}

export interface StaSensor extends StaEntity {
  name: string;
  description: string;
}

export class SensorParser extends StaGrafanaParser<StaSensor, MutableDataFrame<Sensor>> {
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
    );
  }

  protected parseElemAndAdd(elem: StaSensor): void {
    const sensor: Sensor = {
      id: elem['@iot.id'],
      raw: elem,
    };
    sensor.name = elem.name;
    sensor.description = elem.description;
    this.frame.add(sensor);
  }
}
