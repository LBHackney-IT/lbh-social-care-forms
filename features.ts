import { FeatureSet } from 'lib/feature-flags/feature-flags';

type FeatureFlagOptions = {
  environmentName: string;
};

export const getFeatureFlags = ({
  environmentName,
}: FeatureFlagOptions): FeatureSet => {
  const featureFlags: FeatureSet = {
    // FEATURE-FLAG-EXPIRES [3000-12-31]: feature-flags-implementation-proof
    'feature-flags-implementation-proof': {
      isActive: environmentName === 'development',
    },
    // FEATURE-FLAG-EXPIRES [2021-09-31]: case-status
    'case-status': {
      isActive: environmentName === 'development',
    },
    // FEATURE-FLAG-EXPIRES [2021-11-31]: workflows-pilot
    'workflows-pilot': {
      isActive: environmentName === 'development',
    },
    /*
      The feature-flags-implementation-proof has been setup to have an expiry date in the far future.
      The FEATURE-FLAG-EXPIRES comment above will cause ESLint errors once the date in the square brackets has passed.
      Add feature flags below following the format in the example shown.
     */
  };

  return featureFlags;
};
