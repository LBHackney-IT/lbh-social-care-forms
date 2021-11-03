import s from './MashCard.module.scss';
import { MashReferral } from 'types';

interface Props {
  mashReferrals: MashReferral;
}
const FinalDecisionCard = ({ mashReferrals }: Props): React.ReactElement => {
  return (
    <>
      <li className={s.row}>
        <div>
          <p className="lbh-body-m govuk-!-margin-bottom-3">
            <span className="govuk-tag lbh-tag lbh-tag--green">
              4 hours left
            </span>{' '}
            {mashReferrals.createdAt}
            <span className={`lbh-body-l lbh-!-font-weight-bold  ${s.action}`}>
              <a href="#">Action </a>
            </span>
          </p>
          <hr className={s.line} />
          <dl className={s.stats}>
            <div>
              <dt>Name of client</dt>
              <dd>
                <a href="#">{mashReferrals.clients[0]} (referral)</a>
              </dd>
            </div>
            <div>
              <dt>Screening decision</dt>
              <dd>{mashReferrals.screeningDecision}</dd>
            </div>
            <div>
              <dt>Referral category</dt>
              <dd>{mashReferrals.referralCategory}</dd>
            </div>
            <div>
              <a>Assign</a>
            </div>
          </dl>
        </div>
      </li>
      <div className={s.meter}></div>
    </>
  );
};

export default FinalDecisionCard;
