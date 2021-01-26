import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { LegacyForms, Select } from '@grafana/ui';
import React, { PureComponent } from 'react';

import { DataSource } from './DataSource';
import { DataSourceOptions, RequestFunctions, StaQuery } from './types';

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
  { label: 'Things', value: RequestFunctions.Things },
];

export class QueryEditor extends PureComponent<Props, State> {
  defaultRequestFunction: RequestFunctions = RequestFunctions.Things;
  defaultId = '';

  constructor(props: Props) {
    super(props);
    props.query.requestFunction = this.defaultRequestFunction;
    this.state = { method: this.defaultRequestFunction };
    this.props.query.requestArgs = [];
    if (this.defaultId) {
      this.props.query.requestArgs.push(this.defaultId);
    }
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

  setDefault(): any {
    return queryFunctionsSelectable.find(e => e.value === this.defaultRequestFunction);
  }

  render() {
    return (
      <div className="gf-form-inline">
        <div className="gf-form">
          <Select
            prefix="Query Function"
            options={queryFunctionsSelectable}
            defaultValue={this.setDefault()}
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
                defaultValue={this.defaultId}
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
