import PropTypes from 'prop-types';
import Router from 'next/router';

const LinkButton = ({ label, route, internalQuery }) => {
  const handleLink = (url) => window.open(url, '_blank');
  const isExternal = route && route.includes('https://');
  return (
    <button
      href="#"
      role="button"
      draggable="false"
      className={`govuk-button govuk-link-button govuk-!-margin-bottom-3`}
      data-module="govuk-button"
      onClick={() =>
        isExternal
          ? handleLink(route)
          : Router.push(internalQuery ? `${route}${internalQuery}` : `${route}`)
      }
    >
      {label}
    </button>
  );
};

LinkButton.propTypes = {
  internalQuery: PropTypes.string,
  label: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
};

export default LinkButton;
