import { defaultValidation } from './AddressLookup';
import AddressLookupWrapper from './AddressLookupWrapper';
import { AddressBox } from './AddressLookup';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { addressAPIWrapperFactory } from 'factories/postcode';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AddressLookup', () => {
  describe('defaultValidation', () => {
    describe('for address', () => {
      let validate: {
        address: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'You must enter an address';
        postcode: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'You must enter a valid postcode';
        buildingNumber: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'Building number must use valid characters (0-9)';
      };

      beforeEach(() => {
        validate = defaultValidation();
        return validate;
      });

      it('when validation is not required should return true when address has no value', () => {
        expect(validate.address()).toBe(true);
      });

      it('when validation is not required should return true when address is empty string', () => {
        expect(validate.address({ address: '' })).toBe(true);
      });

      it('when validation is not required should return true when address is a non empty string', () => {
        expect(validate.address({ address: 'foo' })).toBe(true);
      });

      it('when validation is required should show message when address has no value', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.address()).toBe('You must enter an address');
        expect(validate.address({ address: '' })).toBe(
          'You must enter an address'
        );
        expect(validate.address({ address: 'foo' })).toBe(true);
      });

      it('when validation is required should show message when address is an empty string', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.address({ address: '' })).toBe(
          'You must enter an address'
        );
        expect(validate.address({ address: 'foo' })).toBe(true);
      });

      it('when validation is required should return true when address is a non empty string', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.address({ address: 'foo' })).toBe(true);
      });
    });

    describe('for postcode', () => {
      let validate: {
        address: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'You must enter an address';
        postcode: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'You must enter a valid postcode';
        buildingNumber: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'Building number must use valid characters (0-9)';
      };

      beforeEach(() => {
        validate = defaultValidation();
        return validate;
      });

      it('when validation is not required should return true when postcode has no value', () => {
        expect(validate.postcode()).toBe(true);
      });

      it('when validation is not required should return true when postcode is empty string', () => {
        expect(validate.postcode({ postcode: '' })).toBe(true);
      });

      it('when validation is not required should return error message when postcode is incorrect format', () => {
        expect(validate.postcode({ postcode: 'foo' })).toBe(
          'You must enter a valid postcode'
        );
      });

      it('when validation is not required should return true when postcode is the correct format', () => {
        expect(validate.postcode({ postcode: 'e83as' })).toBe(true);
      });

      it('when validation is required should show message when postcode has no value', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.postcode()).toBe('You must enter a valid postcode');
      });

      it('when validation is required should return error message when postcode is empty string', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.postcode({ postcode: '' })).toBe(
          'You must enter a valid postcode'
        );
      });

      it('when validation is required should return error message when postcode is incorrect format', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.postcode({ postcode: 'foo' })).toBe(
          'You must enter a valid postcode'
        );
      });

      it('when validation is required should return true when postcode is the correct format', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.postcode({ postcode: 'e83as' })).toBe(true);
      });
    });

    describe('for building number', () => {
      let validate: {
        address: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'You must enter an address';
        postcode: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'You must enter a valid postcode';
        buildingNumber: (
          arg0?: Partial<AddressBox['value']>
        ) => true | 'Building number must use valid characters (0-9)';
      };

      beforeEach(() => {
        validate = defaultValidation();
        return validate;
      });

      it('when validation is not required should return true if building number has no value', () => {
        expect(validate.buildingNumber()).toBe(true);
      });

      it('when validation is not required should return true if building number is empty string', () => {
        expect(validate.buildingNumber({ buildingNumber: '' })).toBe(true);
      });

      it('when validation is not required should return true if building number is non empty string', () => {
        expect(validate.buildingNumber({ buildingNumber: 'foo' })).toBe(true);
      });

      it('when validation is not required should return true if building number is all numeric format', () => {
        const validate = defaultValidation();
        expect(validate.buildingNumber({ buildingNumber: '123' })).toBe(true);
      });

      it('when validation is required should show error message when building number has no value', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.buildingNumber()).toBe(
          'Building number must use valid characters (0-9)'
        );
      });

      it('when validation is required should show error message when building number is empty string', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.buildingNumber({ buildingNumber: '' })).toBe(
          'Building number must use valid characters (0-9)'
        );
      });

      it('when validation is required should show error message when building number is non numeric', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.buildingNumber({ buildingNumber: '123a' })).toBe(
          'Building number must use valid characters (0-9)'
        );
      });

      it('when validation is required should return true when building number is numeric', () => {
        const validate = defaultValidation({ required: true });
        expect(validate.buildingNumber({ buildingNumber: '123' })).toBe(true);
      });
    });
  });

  describe('Address search functionality', () => {
    describe('Use AddressLookup to search Hackney address api', () => {
      it('using default values for building number & postcode', async () => {
        const { getByTestId } = render(
          <AddressLookupWrapper
            postcode="SW1A 0AA"
            buildingNumber="1"
            name="name"
            label="label"
            hint="hint"
          />
        );
        const postcodeInput = getByTestId('postcode') as HTMLInputElement;
        const buildingNumberInput = getByTestId(
          'building-number'
        ) as HTMLInputElement;

        expect(postcodeInput.value).toMatch('SW1A 0AA');
        expect(buildingNumberInput.value).toMatch('1');
      });

      it('checks lookup button calls postcode api correctly', async () => {
        const mocked_results = addressAPIWrapperFactory.build();
        mockedAxios.get.mockResolvedValue({
          data: mocked_results,
        });

        const { getByText, getByTestId } = render(
          <AddressLookupWrapper
            postcode="SW1A 0AA"
            buildingNumber="1"
            name="address"
            label="label"
            hint="hint"
          />
        );

        await waitFor(() => {
          fireEvent.click(getByText('Look up'));
        });

        const addressDropDown = getByTestId('address');
        expect(addressDropDown).not.toBeNull();
        expect(addressDropDown.childElementCount).toBe(
          mocked_results.address.length + 1
        );

        const expectedAddress = getByText('test line1');
        expect(expectedAddress).not.toBeNull();
        expect(expectedAddress).toBeInTheDocument();
      });

      it('checks postcode api errors are handled correctly', async () => {
        const message = 'Network Error';
        mockedAxios.get.mockRejectedValueOnce(new Error(message));

        const { getByText } = render(
          <AddressLookupWrapper
            postcode="SW1A 0AA"
            buildingNumber="1"
            name="address"
            label="label"
            hint="hint"
          />
        );

        await waitFor(() => {
          fireEvent.click(getByText('Look up'));
        });

        const expectedAddress = getByText(
          'There was a problem with the postcode.'
        );
        expect(expectedAddress).not.toBeNull();
        expect(expectedAddress).toBeInTheDocument();
      });
    });
  });
});
