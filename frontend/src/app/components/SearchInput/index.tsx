import * as React from 'react';
import { FormControl, Input, InputAdornment } from '@material-ui/core';
import { Search } from '@material-ui/icons';

export default function SearchInput({ inputFn }) {
  return (
    <FormControl id='searchInput' style={{ width: '90%', padding: '10px 5%', backgroundColor: 'white' }}>
      <Input
        id='input-with-icon-adornment'
        placeholder='Search'
        startAdornment={
          <InputAdornment position='start'>
            <Search />
          </InputAdornment>
        }
        onChange={inputFn}
      />
    </FormControl>
  )
}