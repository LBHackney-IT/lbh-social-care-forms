import { useState } from 'react';
import App, { AppInitialProps, AppContext, AppProps } from 'next/app';
import { NextComponentType } from 'next';
import axios from 'axios';
import { SWRConfig } from 'swr';

import Layout from 'components/Layout';
import GoogleAnalytics from 'components/GoogleAnalytics/GoogleAnalytics';
import { AuthProvider } from 'components/UserContext/UserContext';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';
import { isAuthorised, shouldRedirect } from 'utils/auth';

import type { User } from 'types';

import 'stylesheets/all.scss';
import 'stylesheets/header.scss';
import { FeatureFlagProvider } from '../lib/feature-flags/feature-flags';
import { getFeatureFlags } from 'features';
import { useEffect } from 'react';
import { AppConfigProvider } from 'lib/appConfig';

interface Props {
  user?: Partial<User>;
}

interface ExtendedAppProps extends AppProps<Props> {
  Component: NextComponentType & {
    goBackButton: boolean;
    noLayout: boolean;
  };
}

const CustomApp = ({
  Component,
  pageProps,
}: ExtendedAppProps): JSX.Element | null => {
  const [user] = useState(pageProps.user);
  const [features, setFeatures] = useState(
    getFeatureFlags({
      environmentName: pageProps.environmentName,
    })
  );

  useEffect(() => {
    const environmentName = [
      'localhost:3000',
      'dev.hackney.gov.uk:3000',
      'social-care-service-staging.hackney.gov.uk',
    ].includes(window.location.host)
      ? 'development'
      : 'production';

    const featureSet = getFeatureFlags({
      environmentName,
    });

    setFeatures(featureSet);
  }, []);

  return (
    <AppConfigProvider
      appConfig={{ workflowsPilotUrl: pageProps.workflowsPilotUrl }}
    >
      <FeatureFlagProvider features={features}>
        <SWRConfig
          value={{
            fetcher: (resource, options) =>
              axios.get(resource, options).then((res) => res.data),
            onErrorRetry: (error) => {
              if (error.status === 404) return;
            },
          }}
        >
          <AuthProvider user={user}>
            <GoogleAnalytics>
              <Layout
                goBackButton={Component.goBackButton}
                noLayout={Component.noLayout}
              >
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Layout>
            </GoogleAnalytics>
          </AuthProvider>
        </SWRConfig>
      </FeatureFlagProvider>
    </AppConfigProvider>
  );
};

CustomApp.getInitialProps = async (
  appContext: AppContext
): Promise<AppInitialProps & Props> => {
  let user;

  if (appContext.ctx.req && appContext.ctx.res) {
    user = isAuthorised(appContext.ctx.req) ?? user;
    const redirect =
      appContext.ctx.req.url && shouldRedirect(appContext.ctx.req.url, user);
    if (redirect && appContext.ctx.res.writeHead) {
      appContext.ctx.res.writeHead(302, {
        Location: redirect,
      });
      appContext.ctx.res.end();
    }
  }

  const appProps = await App.getInitialProps(appContext);

  const environmentName = ['development', 'staging'].includes(
    process.env.NEXT_PUBLIC_ENV || ''
  )
    ? 'development'
    : 'production';

  const workflowsPilotUrl = process.env.WORKFLOWS_PILOT_URL;

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      user,
      environmentName,
      workflowsPilotUrl,
    },
  };
};

export default CustomApp;
