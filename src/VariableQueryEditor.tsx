import { SelectableValue } from '@grafana/data';
import { Select } from '@grafana/ui';
import React, { useState } from 'react';

export enum VariableQueryType {
  Datastream = 'Datastream',
  Things = 'Things',
}

const variableQueryType = [
  { label: 'Datastream', value: VariableQueryType.Datastream },
  { label: 'Things', value: VariableQueryType.Things },
];

export interface MyVariableQuery {
  namespace: string;
  query: string;
  queryType: string;
}

interface VariableQueryProps {
  query: MyVariableQuery;
  onChange: (query: MyVariableQuery, definition: string) => void;
}

export const VariableQueryEditor: React.FC<VariableQueryProps> = ({ onChange, query }) => {
  const [state, setState] = useState(query);

  const saveQuery = () => {
    onChange(state, `${state.query} (${state.namespace})`);
  };

  const setRequestFunction = (event: SelectableValue) => {
    setState({
      ...state,
      queryType: event.value,
    });
  };

  return (
    <div className="gf-form">
      <span className="gf-form-label width-10">Sta Entity</span>
      <Select
        prefix="Select STA entity"
        onBlur={saveQuery}
        options={variableQueryType}
        onChange={v => {
          setRequestFunction(v);
        }}
      />
    </div>
  );
};
