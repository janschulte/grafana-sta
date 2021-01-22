import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './DataSource';
import { ConfigEditor } from './ConfigEditor';
// import { VariableQueryEditor } from './VariableQueryEditor';
import { StaQuery, DataSourceOptions } from './types';
import { QueryEditor } from 'QueryEditor';

export const plugin = new DataSourcePlugin<DataSource, StaQuery, DataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
// .setVariableQueryEditor(VariableQueryEditor);
