import axios from 'axios';
import { mockedResident, residentFactory } from 'factories/residents';
import { userFactory } from '../factories/users';

import * as residentsAPI from './residents';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const ENDPOINT_API = process.env.ENDPOINT_API;
const AWS_KEY = process.env.AWS_KEY;

const residentResponse = {
  name: 'foo',
  addressList: [
    {
      endDate: '2004-11-30T00:00:00Z',
      contactAddressFlag: 'N',
      displayAddressFlag: 'N',
      addressLine1: '1 line',
      addressLine2: null,
      addressLine3: null,
      postCode: 'E5 0PU',
    },
    {
      endDate: '2014-02-11T00:00:00Z',
      contactAddressFlag: 'N',
      displayAddressFlag: 'N',
      addressLine1: '2 line',
      addressLine2: null,
      addressLine3: null,
      postCode: 'N17 9RP',
    },
    {
      endDate: null,
      contactAddressFlag: 'Y',
      displayAddressFlag: 'Y',
      addressLine1: 'valid line',
      addressLine2: null,
      addressLine3: null,
      postCode: 'SE9 4RZ',
    },
  ],
};

describe('residents APIs', () => {
  describe('getResidents', () => {
    it('should work properly', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { foo: 123, residents: [residentResponse] },
      });
      const data = await residentsAPI.getResidents({
        foo: 'bar',
      });
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(mockedAxios.get.mock.calls[0][0]).toEqual(
        `${ENDPOINT_API}/residents`
      );
      expect(mockedAxios.get.mock.calls[0][1]?.headers).toEqual({
        'x-api-key': AWS_KEY,
      });
      expect(data).toEqual({
        foo: 123,
        residents: [
          {
            name: 'foo',
            address: { address: 'valid line', postcode: 'SE9 4RZ' },
          },
        ],
      });
    });
  });

  describe('getResident', () => {
    it('should work properly', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          name: 'foobar',
          restricted: 'Y',
        },
      });
      const user = userFactory.build();
      const data = await residentsAPI.getResident(123, user);
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(mockedAxios.get.mock.calls[0][0]).toEqual(
        `${ENDPOINT_API}/residents/123`
      );
      expect(mockedAxios.get.mock.calls[0][1]?.headers).toEqual({
        'x-api-key': AWS_KEY,
      });
      expect(data).toEqual({
        name: 'foobar',
        restricted: 'Y',
        address: undefined,
      });
    });

    it("should pass the auditingEnabled flag as true, along with the user's ID if the user is in the auditable group", async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          name: 'foobar',
          restricted: 'Y',
        },
      });

      const user = userFactory.build({
        isAuditable: true,
      });

      await residentsAPI.getResident(123, user);

      expect(mockedAxios.get.mock.calls[0][1]?.params).toEqual({
        auditingEnabled: true,
        userId: user.email,
      });
    });

    it('should pass the auditingEnabled flag as false and an undefined email if the user is not in the auditable group', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          name: 'foobar',
          restricted: 'Y',
        },
      });

      const user = userFactory.build({
        isAuditable: false,
      });

      await residentsAPI.getResident(123, user);

      expect(mockedAxios.get.mock.calls[0][1]?.params).toEqual({
        auditingEnabled: false,
        userId: undefined,
      });
    });
  });

  describe('addResident', () => {
    it('should work properly', async () => {
      mockedAxios.post.mockResolvedValue({ data: { _id: 'foobar' } });
      const data = await residentsAPI.addResident(mockedResident);
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(mockedAxios.post.mock.calls[0][0]).toEqual(
        `${ENDPOINT_API}/residents`
      );
      expect(mockedAxios.post.mock.calls[0][1]).toEqual(mockedResident);
      expect(mockedAxios.post.mock.calls[0][2]?.headers).toEqual({
        'Content-Type': 'application/json',
        'x-api-key': AWS_KEY,
      });
      expect(data).toEqual({ _id: 'foobar' });
    });
  });

  describe('updateResident', () => {
    it('should work properly', async () => {
      mockedAxios.patch.mockResolvedValue({ data: { _id: 'foobar' } });
      const data = await residentsAPI.updateResident(mockedResident);
      expect(mockedAxios.patch).toHaveBeenCalled();
      expect(mockedAxios.patch.mock.calls[0][0]).toEqual(
        `${ENDPOINT_API}/residents`
      );
      expect(mockedAxios.patch.mock.calls[0][1]).toEqual(mockedResident);
      expect(mockedAxios.patch.mock.calls[0][2]?.headers).toEqual({
        'Content-Type': 'application/json',
        'x-api-key': AWS_KEY,
      });
      expect(data).toEqual(mockedResident);
    });
  });

  describe('normalisePhoneInput', () => {
    it('should work properly', () => {
      expect(
        residentsAPI.normalisePhoneInput(
          residentFactory.build({
            phoneNumbers: [
              { number: '213213', type: '' },
              { number: '12321', type: 'qwe' },
              { number: '321321', type: '' },
            ],
          })
        )
      ).toEqual({
        phoneNumbers: [
          { number: '213213', type: 'main' },
          { number: '12321', type: 'qwe' },
          { number: '321321', type: 'main' },
        ],
        address: {
          address: 'sjakdjlk',
          postcode: 'hdsadjk',
        },
        addresses: [],
        contextFlag: 'A',
        createdBy: 'foo@bar.com',
        dateOfBirth: '2020-11-13',
        firstName: 'Foo',
        gender: 'F',
        id: 2,
        lastName: 'Bar',
        nhsNumber: 12345,
        otherNames: [],
      });
    });
  });
});
