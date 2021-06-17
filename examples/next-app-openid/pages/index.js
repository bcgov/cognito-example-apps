import { Container } from 'semantic-ui-react';
import { Table, Button } from 'semantic-ui-react';
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

export default function Home({ tokens, verified_tokens, claim_validity }) {
  if (!tokens) {
    return (
      <Container>
        <Button primary onClick={() => (window.location = '/oauth/cognito/login')}>
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h3>Tokens</h3>
      <ObjectTable obj={tokens} />

      <h3>Verified Tokens</h3>
      <ObjectTable obj={verified_tokens} />

      <h3>Claim Validity</h3>
      <ObjectTable obj={claim_validity} />

      <Button primary onClick={() => (window.location = '/oauth/cognito/logout')}>
        Logout
      </Button>
    </Container>
  );
}

export async function getServerSideProps({ req, res, query: params }) {
  return {
    props: {
      tokens: req.session?.tokens || null,
      verified_tokens: req.session?.verified_tokens || null,
      claim_validity: req.session?.claim_validity || null,
    },
  };
}
