import { render } from '@testing-library/react';
import { FeatureFlagProvider } from 'lib/feature-flags/feature-flags';

import DashboardWrapper from './DashboardWrapper';

const mockedUseRouter = { pathname: '/my-cases' };

jest.mock('next/router', () => ({
  useRouter: () => mockedUseRouter,
}));

describe(`DashboardWrapper`, () => {
  it('should render properly', () => {
    const { asFragment } = render(
      <FeatureFlagProvider features={{}}>
        <DashboardWrapper>
          <div>foo</div>
        </DashboardWrapper>
      </FeatureFlagProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
