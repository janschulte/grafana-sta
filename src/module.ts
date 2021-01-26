import { DataSourcePlugin } from '@grafana/data';
import { QueryEditor } from 'QueryEditor';

import { ConfigEditor } from './ConfigEditor';
import { DataSource } from './DataSource';
import { DataSourceOptions, StaQuery } from './types';
import { VariableQueryEditor } from './VariableQueryEditor';

export const plugin = new DataSourcePlugin<DataSource, StaQuery, DataSourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)
  .setVariableQueryEditor(VariableQueryEditor);
