import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { residentFactory } from 'factories/residents';
import {
  mockedRelationshipFactory,
  mockedRelationshipData,
  mockedExistingRelationship,
} from 'factories/relationships';
import AddRelationshipForm from './AddRelationshipForm';
import PersonView from '../../PersonView/PersonView';
import { AuthProvider } from '../../UserContext/UserContext';
import { mockedUser } from '../../../factories/users';
import { createMockedPersonView } from '../../../test/helpers';
import * as relationshipsAPI from 'utils/api/relationships';
import * as residentsAPI from 'utils/api/residents';
import { mockedAPIservererror } from 'factories/APIerrors';

jest.mock('../../PersonView/PersonView');
jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    events: {
      on: jest.fn(),
    },
    push: jest.fn(),
  },
  useRouter: () => ({
    query: { foo: 'bar' },
    replace: jest.fn(),
    pathname: 'foopath',
  }),
}));

const mockedResident = residentFactory.build();
const selectedRelatedResident = residentFactory.build();

(PersonView as jest.Mock).mockImplementation(
  createMockedPersonView(mockedResident)
);

describe('<AddRelationshipForm />', () => {
  describe('Relationship types', () => {
    beforeEach(() => {
      jest.spyOn(residentsAPI, 'useResident').mockImplementation(() => ({
        data: residentFactory.build(),
        isValidating: false,
        mutate: jest.fn(),
        revalidate: jest.fn(),
      }));
    });

    it('sorts by alphabetical order', async () => {
      jest
        .spyOn(relationshipsAPI, 'useRelationships')
        .mockImplementation(() => ({
          data: mockedRelationshipFactory.build(),
          isValidating: false,
          mutate: jest.fn(),
          revalidate: jest.fn(),
        }));

      render(
        <AuthProvider user={mockedUser}>
          <AddRelationshipForm
            personId={mockedResident.id}
            secondPersonId={selectedRelatedResident.id}
          />
        </AuthProvider>
      );

      const dropdown = screen.getByRole('combobox', {
        name: /Relationship type/,
      });
      const dropdownOptions = dropdown.childNodes;

      expect(dropdownOptions[1]).toHaveValue('acquaintance');
      expect(dropdownOptions[2]).toHaveValue('auntUncle');
      expect(dropdownOptions[3]).toHaveValue('child');
    });

    it('does not show "Parent of unborn child" and "Sibling of unborn child"', async () => {
      jest
        .spyOn(relationshipsAPI, 'useRelationships')
        .mockImplementation(() => ({
          data: mockedRelationshipFactory.build(),
          isValidating: false,
          mutate: jest.fn(),
          revalidate: jest.fn(),
        }));

      render(
        <AuthProvider user={mockedUser}>
          <AddRelationshipForm
            personId={mockedResident.id}
            secondPersonId={selectedRelatedResident.id}
          />
        </AuthProvider>
      );

      expect(
        screen.queryByText('Parent of unborn child')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Sibling of unborn child')
      ).not.toBeInTheDocument();
    });

    it('disables an option where a relationship type for selected person already exists', async () => {
      const selectedRelatedResidentRelationship =
        mockedExistingRelationship.build({
          personId: selectedRelatedResident.id,
        });
      const someOtherResidentRelationship = mockedExistingRelationship.build();

      jest
        .spyOn(relationshipsAPI, 'useRelationships')
        .mockImplementation(() => ({
          data: mockedRelationshipFactory.build({
            personId: mockedResident.id,
            personalRelationships: [
              mockedRelationshipData.build({
                type: 'acquaintance',
                relationships: [
                  selectedRelatedResidentRelationship,
                  someOtherResidentRelationship,
                ],
              }),
            ],
          }),
          isValidating: false,
          mutate: jest.fn(),
          revalidate: jest.fn(),
        }));

      render(
        <AuthProvider user={mockedUser}>
          <AddRelationshipForm
            personId={mockedResident.id}
            secondPersonId={selectedRelatedResident.id}
          />
        </AuthProvider>
      );

      const dropdown = screen.getByRole('combobox', {
        name: /Relationship type/,
      });
      const dropdownOptions = Array.from(dropdown.childNodes);

      expect(
        dropdownOptions.find((option) => option.textContent === 'Acquaintance')
      ).toBeDisabled();
    });

    it('disables all the options where the relationship types for selected person already exists', async () => {
      const selectedRelatedResidentRelationship =
        mockedExistingRelationship.build({
          personId: selectedRelatedResident.id,
        });
      const someOtherResidentRelationship = mockedExistingRelationship.build();

      jest
        .spyOn(relationshipsAPI, 'useRelationships')
        .mockImplementation(() => ({
          data: mockedRelationshipFactory.build({
            personId: mockedResident.id,
            personalRelationships: [
              mockedRelationshipData.build({
                type: 'acquaintance',
                relationships: [
                  selectedRelatedResidentRelationship,
                  someOtherResidentRelationship,
                ],
              }),
              mockedRelationshipData.build({
                type: 'other',
                relationships: [selectedRelatedResidentRelationship],
              }),
            ],
          }),
          isValidating: false,
          mutate: jest.fn(),
          revalidate: jest.fn(),
        }));

      render(
        <AuthProvider user={mockedUser}>
          <AddRelationshipForm
            personId={mockedResident.id}
            secondPersonId={selectedRelatedResident.id}
          />
        </AuthProvider>
      );

      const dropdown = screen.getByRole('combobox', {
        name: /Relationship type/,
      });
      const dropdownOptions = Array.from(dropdown.childNodes);

      expect(
        dropdownOptions.find((option) => option.textContent === 'Acquaintance')
      ).toBeDisabled();
      expect(
        dropdownOptions.find((option) => option.textContent === 'Other')
      ).toBeDisabled();
    });

    it('shows an error message if error when getting relationships', async () => {
      jest
        .spyOn(relationshipsAPI, 'useRelationships')
        .mockImplementation(() => ({
          data: undefined,
          error: mockedAPIservererror,
          revalidate: jest.fn(),
          mutate: jest.fn(),
          isValidating: false,
        }));

      render(
        <AuthProvider user={mockedUser}>
          <AddRelationshipForm
            personId={mockedResident.id}
            secondPersonId={selectedRelatedResident.id}
          />
        </AuthProvider>
      );

      expect(
        screen.queryByText(
          /There was a problem with getting current personal relationships./
        )
      ).toBeInTheDocument();
    });
  });

  describe('Relationship additional options', () => {
    beforeEach(() => {
      jest
        .spyOn(relationshipsAPI, 'useRelationships')
        .mockImplementation(() => ({
          data: mockedRelationshipFactory.build(),
          isValidating: false,
          mutate: jest.fn(),
          revalidate: jest.fn(),
        }));
      jest.spyOn(residentsAPI, 'useResident').mockImplementation(() => ({
        data: residentFactory.build(),
        isValidating: false,
        mutate: jest.fn(),
        revalidate: jest.fn(),
      }));

      render(
        <AuthProvider user={mockedUser}>
          <AddRelationshipForm
            personId={mockedResident.id}
            secondPersonId={selectedRelatedResident.id}
          />
        </AuthProvider>
      );
    });

    it('does not show if placeholder', async () => {
      await waitFor(() => {
        userEvent.selectOptions(
          screen.getByRole('combobox', { name: /Relationship type/ }),
          [screen.getByRole('option', { name: /Relationship type/ })]
        );
      });

      const typeOptions = screen.queryByText(/Select all that apply/);

      expect(typeOptions).toBeNull();
    });

    it('does not show if unborn child', async () => {
      await waitFor(() => {
        userEvent.selectOptions(
          screen.getByRole('combobox', { name: /Relationship type/ }),
          [screen.getByText('Unborn child')]
        );
      });

      const typeOptions = screen.queryByText(/Select all that apply/);

      expect(typeOptions).toBeNull();
    });

    it('does not show if unborn sibling', async () => {
      await waitFor(() => {
        userEvent.selectOptions(
          screen.getByRole('combobox', { name: /Relationship type/ }),
          [screen.getByText('Unborn sibling')]
        );
      });

      const typeOptions = screen.queryByText(/Select all that apply/);

      expect(typeOptions).toBeNull();
    });

    it('shows "Parent of an unborn child" option if parent chosen', async () => {
      userEvent.selectOptions(
        screen.getByRole('combobox', { name: /Relationship type/ }),
        [screen.getByText('Parent')]
      );

      expect(screen.getByText(/Parent of an unborn child/)).toBeInTheDocument();
    });

    it('shows "Sibling of an unborn child" option if sibling chosen', async () => {
      userEvent.selectOptions(
        screen.getByRole('combobox', { name: /Relationship type/ }),
        [screen.getByText('Sibling')]
      );

      expect(
        screen.getByText(/Sibling of an unborn child/)
      ).toBeInTheDocument();
    });
  });

  it('shows the name of selected person', () => {
    jest.spyOn(relationshipsAPI, 'useRelationships').mockImplementation(() => ({
      data: mockedRelationshipFactory.build(),
      isValidating: false,
      mutate: jest.fn(),
      revalidate: jest.fn(),
    }));
    jest.spyOn(residentsAPI, 'useResident').mockImplementation(() => ({
      data: residentFactory.build({ firstName: 'Chloe', lastName: 'Price' }),
      isValidating: false,
      mutate: jest.fn(),
      revalidate: jest.fn(),
    }));

    render(
      <AuthProvider user={mockedUser}>
        <AddRelationshipForm
          personId={mockedResident.id}
          secondPersonId={selectedRelatedResident.id}
        />
      </AuthProvider>
    );

    expect(screen.queryByText(/Chloe Price/)).toBeInTheDocument();
  });

  it('shows an error message if error when getting other person', () => {
    jest.spyOn(residentsAPI, 'useResident').mockImplementation(() => ({
      data: undefined,
      error: mockedAPIservererror,
      revalidate: jest.fn(),
      mutate: jest.fn(),
      isValidating: false,
    }));

    render(
      <AuthProvider user={mockedUser}>
        <AddRelationshipForm
          personId={mockedResident.id}
          secondPersonId={selectedRelatedResident.id}
        />
      </AuthProvider>
    );

    expect(
      screen.queryByText(
        /There was a problem with getting the details of the selected resident./
      )
    ).toBeInTheDocument();
  });

  describe('Context of relationship', () => {
    beforeEach(() => {
      jest.spyOn(residentsAPI, 'useResident').mockImplementation(() => ({
        data: residentFactory.build(),
        isValidating: false,
        mutate: jest.fn(),
        revalidate: jest.fn(),
      }));
      jest
        .spyOn(relationshipsAPI, 'useRelationships')
        .mockImplementation(() => ({
          data: mockedRelationshipFactory.build(),
          isValidating: false,
          mutate: jest.fn(),
          revalidate: jest.fn(),
        }));

      render(
        <AuthProvider user={mockedUser}>
          <AddRelationshipForm
            personId={mockedResident.id}
            secondPersonId={selectedRelatedResident.id}
          />
        </AuthProvider>
      );
    });

    it('displays an error message if over 64 characters', async () => {
      const context = screen.getByLabelText('Context of relationship');
      const textMoreThan64Characters = 'A'.repeat(65);

      fireEvent.change(context, {
        target: { value: textMoreThan64Characters },
      });
      fireEvent.submit(screen.getByRole('form'));

      await waitFor(() => {
        const errorMessage = screen.queryByText(
          'Enter a context of relationship that is 64 characters or fewer',
          {
            selector: '.govuk-error-message',
          }
        );

        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('does not display an error message if 64 characters', async () => {
      const context = screen.getByLabelText('Context of relationship');
      const textExactly64Characters = 'A'.repeat(64);

      fireEvent.change(context, {
        target: { value: textExactly64Characters },
      });
      fireEvent.submit(screen.getByRole('form'));

      await waitFor(() => {
        const errorMessage = screen.queryByText(
          'Enter a context of relationship that is 64 characters or fewer',
          {
            selector: '.govuk-error-message',
          }
        );

        expect(errorMessage).toBeNull();
      });
    });
  });
});
