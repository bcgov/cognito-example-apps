import { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { Table, Button } from 'semantic-ui-react';
import isObject from 'lodash/isObject';
import axios from 'axios';
import store2 from 'store2';

const getValue = (val) => {
  return isObject(val) ? JSON.stringify(val) : String(val);
};

const ObjectTable = ({ obj }) => {
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
              <Table.Cell style={{ overflowWrap: 'anywhere' }}>{getValue(obj[field])}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default function Home() {
  const [info, setInfo] = useState({});
  const accessToken = store2('app-token');

  useEffect(async () => {
    if (!accessToken) return;

    const data = await axios
      .get('/api/oauth/cognito/info', {
        headers: { ['x-access-token']: accessToken },
      })
      .then(
        (res) => res.data,
        () => ({})
      );

    if (data.success) {
      setInfo(data.data);
    } else {
    }
  }, []);

  const login = () => {
    window.location = '/api/oauth/cognito/login';
  };

  const clearCache = () => {
    store2.remove('app-token');
    window.location.reload();
  };

  const infoFields = Object.keys(info);

  if (infoFields.length === 0) {
    return (
      <Container>
        <h3>No app token found in browser storage or has invalid token.</h3>
        <Button primary onClick={login}>
          Login
        </Button>
        <Button onClick={clearCache}>Clear Cache</Button>
      </Container>
    );
  }

  return (
    <Container>
      <h3>User Info</h3>
      <ObjectTable obj={info} />

      <Button onClick={clearCache}>Clear Cache</Button>
    </Container>
  );
}
