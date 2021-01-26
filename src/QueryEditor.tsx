import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { LegacyForms, Select } from '@grafana/ui';
import React, { PureComponent } from 'react';

import { DataSource } from './DataSource';
import { enumKeys } from './helper';
import { DataSourceOptions, RequestFunctions, StaQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, StaQuery, DataSourceOptions>;

type State = {
  method: RequestFunctions;
};

const queryFunctionsSelectable = enumKeys(RequestFunctions).map(e => ({ label: e, value: e }));

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

  setDefault() {
    return queryFunctionsSelectable.find(e => e.value === this.defaultRequestFunction);
  }

  getDatastreamIdInput() {
    switch (this.state.method) {
      case RequestFunctions.Datastreams:
      case RequestFunctions.Things:
        return null;
      default:
        return (
          <FormField
            width={15}
            onChange={(v: any) => {
              this.onFirstArgChange(v);
            }}
            defaultValue={this.defaultId}
            label="datastreamId"
            type="string"
          />
        );
    }
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
          {this.getDatastreamIdInput()}
        </div>
      </div>
    );
  }
}
