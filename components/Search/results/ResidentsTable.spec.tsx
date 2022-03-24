import { render } from '@testing-library/react';

import ResidentsTable from './ResidentsTable';
import {
  legacyResidentFactory,
  mockedLegacyResident,
} from 'factories/residents';
import { UserContext } from '../../UserContext/UserContext';
import { mockedUser, userFactory } from '../../../factories/users';

describe('ResidentsTable component', () => {
  it('should render a list of residents', () => {
    const { asFragment } = render(
      <UserContext.Provider value={{ user: mockedUser }}>
        <ResidentsTable records={[mockedLegacyResident]} />
      </UserContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render a restricted flag against any residents that the current user cannot manage cases for', () => {
    const { getByText } = render(
      <UserContext.Provider
        value={{
          user: userFactory.build({
            hasAdminPermissions: false,
            hasDevPermissions: false,
            hasChildrenPermissions: false,
            hasUnrestrictedPermissions: false,
            hasAllocationsPermissions: false,
            hasAdultPermissions: true,
          }),
        }}
      >
        <ResidentsTable
          records={[
            legacyResidentFactory.build({
              ageContext: 'C',
            }),
          ]}
        />
      </UserContext.Provider>
    );

    getByText('Restricted');
  });

  it('should render a resident without an address', () => {
    const { asFragment } = render(
      <UserContext.Provider
        value={{
          user: userFactory.build({
            hasAdminPermissions: false,
            hasDevPermissions: false,
            hasChildrenPermissions: false,
            hasUnrestrictedPermissions: false,
            hasAllocationsPermissions: false,
            hasAdultPermissions: true,
          }),
        }}
      >
        <ResidentsTable
          records={[
            legacyResidentFactory.build({
              ageContext: 'C',
              address: undefined,
            }),
          ]}
        />
      </UserContext.Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('when the address is less than 20 characters should render the full address and postcode', () => {
    const { asFragment } = render(
      <UserContext.Provider
        value={{
          user: userFactory.build({
            hasAdminPermissions: false,
            hasDevPermissions: false,
            hasChildrenPermissions: false,
            hasUnrestrictedPermissions: false,
            hasAllocationsPermissions: false,
            hasAdultPermissions: true,
          }),
        }}
      >
        <ResidentsTable
          records={[
            legacyResidentFactory.build({
              ageContext: 'C',
              address: {
                address: 'short address',
                postcode: 'E8 1AA',
              },
            }),
          ]}
        />
      </UserContext.Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('when the address is more than 20 characters should render the truncated address and postcode', () => {
    const { asFragment } = render(
      <UserContext.Provider
        value={{
          user: userFactory.build({
            hasAdminPermissions: false,
            hasDevPermissions: false,
            hasChildrenPermissions: false,
            hasUnrestrictedPermissions: false,
            hasAllocationsPermissions: false,
            hasAdultPermissions: true,
          }),
        }}
      >
        <ResidentsTable
          records={[
            legacyResidentFactory.build({
              ageContext: 'C',
              address: {
                address: 'really really long address',
                postcode: 'E8 1AA',
              },
            }),
          ]}
        />
      </UserContext.Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
