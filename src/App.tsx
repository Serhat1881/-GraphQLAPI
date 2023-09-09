import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { TextField, Button, List, ListItem, Container, Stack, Chip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

interface Country {
  code: string;
  name: string;
}

const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql',
  cache: new InMemoryCache(),
});

const COUNTRIES_QUERY = gql`
  query {
    countries {
      code
      name
    }
  }
`;

const App: React.FC = () => {
  const { data, loading, error } = useQuery<{ countries: Country[] }>(COUNTRIES_QUERY, { client });
  const [filter, setFilter] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const handleCountryClick = (code: string) => {
    if (selected.includes(code)) {
      setSelected(selected.filter((item) => item !== code));
    } else {
      setSelected([...selected, code]);
    }
  };

  const removeCountry = (code: string) => {
    setSelected(selected.filter((item) => item !== code));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  let countries = data?.countries || [];

  if (filter) {
    countries = countries.filter((country) =>
      country.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  const selectedCountryNames = selected.map((code) =>
    countries.find((country) => country.code === code)
  );

  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      margin: 'auto',
      padding: '20px'
    }}>
      <TextField
          label="Search"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Stack direction="row" gap={1} width="40%" mt={2} flexWrap="wrap" justifyContent="center" alignItems="center">
          {selectedCountryNames.map((country) => (
            <Chip
              key={country?.code}
              label={country?.name}
              onDelete={() => removeCountry(country?.code!)}
              deleteIcon={<CancelIcon />}
            />
          ))}
        </Stack>
      <List>
        {countries.slice(0, visibleCount).map((country) => (
          <ListItem
            key={country.code}
            onClick={() => handleCountryClick(country.code)}
            selected={selected.includes(country.code)}
            sx={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              margin: '5px 0',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '200px'
            }}
          >
            {country.name}
          </ListItem>
        ))}
      </List>
      {visibleCount < countries.length && (
        <Button variant="contained" color="primary" onClick={() => setVisibleCount(visibleCount + 10)}>
          Daha Fazla Göster
        </Button>
      )}
    </Container>
  );
};

export default App;
