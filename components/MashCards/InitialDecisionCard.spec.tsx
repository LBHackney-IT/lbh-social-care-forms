import { render, screen } from '@testing-library/react';
import { mockedMashReferral } from 'factories/mashReferral';
import InitialDecisionCard from './InitialDecisionCard';
import { format } from 'date-fns';

describe('InitialDecisionCard', () => {
  it('renders the right info from the mash referral', () => {
    render(<InitialDecisionCard mashReferral={mockedMashReferral} />);
    expect(
      screen.getByText(`submitted{' '}
    ${format(new Date(mockedMashReferral.createdAt), 'HH:00 dd MMM')}`)
    );
    expect(screen.getByText(`${mockedMashReferral.clients[0]} (referral)`));
    expect(screen.getByText(mockedMashReferral.requestedSupport as string));
    expect(screen.getByText('Make decision'));
    expect(screen.getByText('Assign'));
    expect(screen.getByText('Name of client'));
    expect(screen.getByText('Requested support'));
  });
});
