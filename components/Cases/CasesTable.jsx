import PropTypes from 'prop-types';

const onClick = (url) => window.open(url, '_blank');

const CasesEntry = ({
  formName,
  caseFormUrl,
  officerEmail,
  caseFormTimestamp,
}) => (
  <tr className="govuk-table__row">
    <td className="govuk-table__cell">{caseFormTimestamp}</td>
    <td className="govuk-table__cell">{formName}</td>
    <td className="govuk-table__cell">
      {officerEmail && `- created by ${officerEmail}`}
    </td>
    <td className="govuk-table__cell govuk-button--secondary'">
      <a href="#" className="govuk-link" onClick={() => onClick(caseFormUrl)}>
        View
      </a>
    </td>
  </tr>
);

const CasesTable = ({ cases }) => (
  <table className="govuk-table">
    <tbody className="govuk-table__body">
      {cases.map((result) => (
        <CasesEntry key={result.personId} {...result} />
      ))}
    </tbody>
  </table>
);

CasesTable.propTypes = {
  cases: PropTypes.arrayOf(
    PropTypes.shape({
      personId: PropTypes.number.isRequired,
      formName: PropTypes.string.isRequired,
      caseFormUrl: PropTypes.string.isRequired,
      officerEmail: PropTypes.string.isRequired,
      caseFormTimestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CasesTable;
