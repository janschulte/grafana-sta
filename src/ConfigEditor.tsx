import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { DataSourceHttpSettings } from '@grafana/ui';
import React, { ComponentType } from 'react';
import { DataSourceOptions } from './types';

type Props = DataSourcePluginOptionsEditorProps<DataSourceOptions>;

export const ConfigEditor: ComponentType<Props> = ({ options, onOptionsChange }) => {
  return (
    <>
      <DataSourceHttpSettings
        defaultUrl={'http://localhost:8081/v1.1/'}
        dataSourceConfig={options}
        showAccessOptions={true}
        onChange={onOptionsChange}
      />
    </>
  );
};
