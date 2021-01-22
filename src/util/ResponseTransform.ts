import { FeatureOfInterestFrame, ObservedPropertyFrame, SensorFrame } from 'types';

// Transform STA FeatureOfInterest into frame
export function parseIntoFOIFrame(frame: FeatureOfInterestFrame, response: any) {
  response!.value!.forEach((element: any) => {
    frame.appendRow([
      element['@iot.id'],
      element['name'],
      element.feature.coordinates[0],
      element.feature.coordinates[1],
      1,
    ]);
  });
}

// Transform STA Sensor into frame
export function parseIntoSensorFrame(frame: SensorFrame, response: any) {
  console.log(response);
  frame.appendRow([
    response['@iot.id'],
    response['name'],
    response['description'],
    {
      raw: response,
      toString(): string {
        return JSON.stringify(this.raw, null, 4);
      },
    },
  ]);
}

// Transform STA ObservedProperty into frame
export function parseIntoObservedPropertyFrame(frame: ObservedPropertyFrame, response: any) {
  console.log(response);
  frame.appendRow([
    response['@iot.id'],
    response['name'],
    response['definition'],
    {
      raw: response,
      toString(): string {
        return JSON.stringify(this.raw, null, 4);
      },
    },
  ]);
}
