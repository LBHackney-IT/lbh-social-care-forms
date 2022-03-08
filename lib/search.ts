import axios from 'axios';
import type { ResidentsAPI, LegacyResident } from 'types';

const ENDPOINT_API = process.env.ENDPOINT_API;
const AWS_KEY = process.env.AWS_KEY;
const headers = { 'x-api-key': AWS_KEY };

interface ResidentBE extends LegacyResident {
  addressList: Array<{
    displayAddressFlag: 'Y' | 'N';
    addressLine1: string;
    postCode: string;
    uprn: string;
  }>;
}

const sanitiseResidentData = (residents: ResidentBE[]): LegacyResident[] =>
  residents?.map(({ addressList, ...resident }: ResidentBE): LegacyResident => {
    const address = addressList?.find(
      ({ displayAddressFlag }) => displayAddressFlag === 'Y'
    );
    return {
      ...resident,
      address: address && {
        address: address.addressLine1,
        postcode: address.postCode,
        uprn: address.uprn,
      },
    };
  });

export const searchPerson = async (
  params: Record<string, unknown>,
  contextFlag?: string
): Promise<ResidentsAPI> => {
  const { data } = await axios.get(`${ENDPOINT_API}/search/person`, {
    headers,
    params: { ...params, contextFlag },
  });
  return { ...data, residents: sanitiseResidentData(data.residents) };
};
