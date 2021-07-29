import { ConditionalFeature } from '../../../lib/feature-flags/feature-flags';
import { useAuth } from '../../UserContext/UserContext';
import s from './Footer.module.scss';

const Footer = (): React.ReactElement => {
  const { user } = useAuth();

  const feedbackLink = process.env.NEXT_PUBLIC_FEEDBACK_LINK || '';

  return (
    <footer className={`${s.footer}`} role="contentinfo">
      <div className="govuk-width-container">
        <nav className={s.links}>
          <a href="https://sites.google.com/hackney.gov.uk/moderntoolsforsocialcare">
            Roadmap
          </a>
          <a href={feedbackLink}>Give feedback</a>
        </nav>

        <div className={s.meta}>Built and maintained by HackIT.</div>

        <ConditionalFeature name="feature-flags-implementation-proof">
          {user?.hasAdminPermissions && (
            <div className={s.meta}>Feature flags are active and working</div>
          )}
        </ConditionalFeature>
      </div>
    </footer>
  );
};

export default Footer;
