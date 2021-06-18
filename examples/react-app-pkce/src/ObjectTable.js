import React from 'react';
import { Table } from 'semantic-ui-react';
import isObject from 'lodash/isObject';

const getValue = (val) => {
  return isObject(val) ? JSON.stringify(val) : String(val);
};

const parseJSON = (val) => {
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

const JsonDisplay = ({ value }) => {
  value = parseJSON(getValue(value));
  if (typeof value === 'string') return value;
  return <pre>{JSON.stringify(value, null, 4)}</pre>;
};

const ObjectTable = ({ obj }) => {
  if (!obj) return null;

  const fields = Object.keys(obj);

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Key</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {fields.map((field) => {
          return (
            <Table.Row key={field}>
              <Table.Cell>{field}</Table.Cell>
              <Table.Cell style={{ overflowWrap: 'anywhere' }}>
                <JsonDisplay value={obj[field]} />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default ObjectTable;
