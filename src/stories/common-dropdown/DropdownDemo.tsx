import React from 'react';
import {
  DropdownItem,
  DropdownRoot,
  DropdownContent,
  DropdownTrigger,
} from '../../components/common/common-dropdown';

const DropdownDemo = () => {
  return (
    <DropdownRoot>
      <DropdownTrigger style={{ color: 'black' }}>Dropdown</DropdownTrigger>
      <DropdownContent>
        <DropdownItem>item 1</DropdownItem>
        <DropdownItem>item 2</DropdownItem>
        <DropdownItem>item 3</DropdownItem>
        <DropdownItem>item 4</DropdownItem>
        <DropdownItem>item 5</DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
};

export default DropdownDemo;
