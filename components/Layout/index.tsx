import Seo from './Seo/Seo';
import Header from './Header/Header';
import SkipLink from './SkipLink/SkipLink';
import PhaseBanner from './PhaseBanner/PhaseBanner';
import BackButton from './BackButton/BackButton';
import Footer from './Footer/Footer';
import OnboardingDialog from 'components/OnboardingDialog';

export interface Props {
  children: React.ReactChild;
  goBackButton: boolean;
  noLayout: boolean;
}

const Layout = ({
  children,
  goBackButton = false,
  noLayout = false,
}: Props): React.ReactElement => {
  if (noLayout) return <>{children}</>;

  const feedbackLink = process.env.NEXT_PUBLIC_FEEDBACK_LINK || '';
  return (
    <>
      <Seo title="Social Care Admin - Hackney Council" />
      <SkipLink />
      <Header serviceName="Social Care" />
      <PhaseBanner phase="beta" feedbackLink={feedbackLink} />
      {goBackButton && <BackButton />}

      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="content" role="main">
          {children}
        </main>
      </div>

      <OnboardingDialog />

      <Footer />
    </>
  );
};

export default Layout;
