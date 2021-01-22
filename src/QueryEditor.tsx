import React, { PureComponent } from 'react';
import { Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './DataSource';
import { DataSourceOptions, RequestFunctions, StaQuery } from './types';

import { LegacyForms } from '@grafana/ui';
const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, StaQuery, DataSourceOptions>;

type State = {
  method: RequestFunctions;
};

const queryFunctionsSelectable = [
  { label: 'getDatastreams', value: RequestFunctions.getDatastreams },
  { label: 'getDatastream', value: RequestFunctions.getDatastream },
  { label: 'getObservedPropertyByDatastreamId', value: RequestFunctions.getObservedPropertyByDatastreamId },
  { label: 'getObservationsByDatastreamId', value: RequestFunctions.getObservationsByDatastreamId },
  { label: 'getSensorByDatastreamId', value: RequestFunctions.getSensorByDatastreamId },
  { label: 'getObservationsByCustom', value: RequestFunctions.getObservationsByCustom },
];

export class QueryEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    props.query.requestFunction = RequestFunctions.getDatastreams;
    this.state = {
      method: RequestFunctions.getDatastreams,
    };
    this.props.query.requestArgs = [];
  }

  setRequestFunction = (event: SelectableValue) => {
    const { query } = this.props;
    query.requestFunction = event.value;
    this.setState({
      method: event.value,
    });
  };

  onFirstArgChange = (event: any) => {
    const { query } = this.props;
    query.requestArgs[0] = event.target.value;
  };

  render() {
    return (
        <div className="gf-form-inline">
          <div className="gf-form">
            <Select
              prefix="Query Function"
              options={queryFunctionsSelectable}
              defaultValue={queryFunctionsSelectable[0]}
              onChange={v => {
                this.setRequestFunction(v);
              }}
            />
            <></>
            {this.state.method !== RequestFunctions.getObservationsByCustom &&
              this.state.method !== RequestFunctions.getDatastreams && (
                <FormField
                  width={15}
                  onChange={(v: any) => {
                    this.onFirstArgChange(v);
                  }}
                  label="Id"
                  type="string"
                />
              )}
            {this.state.method === RequestFunctions.getObservationsByCustom && (
              <FormField
                width={15}
                onChange={(v: any) => {
                  this.onFirstArgChange(v);
                }}
                label="Custom Query"
                type="string"
              />
            )}
          </div>
        </div>
    );
  }
}
