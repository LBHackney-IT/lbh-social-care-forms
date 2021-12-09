import { fireEvent, render, screen } from '@testing-library/react';
import { mockedMashReferral } from 'factories/mashReferral';
import { mashReferralFactory } from 'factories/mashReferral';
import InitialDecisionCard from './InitialDecisionCard';
import { format } from 'date-fns';

describe('InitialDecisionCard', () => {
  it('renders the right info from the mash referral', () => {
    render(<InitialDecisionCard mashReferral={mockedMashReferral} />);
    expect(
      screen.getByText(
        `submitted ${format(
          new Date(mockedMashReferral.createdAt),
          'HH:00 dd MMM'
        )}`
      )
    );
    expect(screen.getByText(`${mockedMashReferral.clients[0]} (referral)`));
    expect(screen.getByText(mockedMashReferral.requestedSupport as string));
    expect(screen.getByText('Make decision'));
    expect(screen.getByText('Assign'));
    expect(screen.getByText('Name of client'));
    expect(screen.getByText('Requested support'));
  });
  it('displays high priority if the contact is marked as urgent on the previous stage', () => {
    const priorityMockReferral = mashReferralFactory.build({
      contactUrgentContactRequired: true,
    });
    render(<InitialDecisionCard mashReferral={priorityMockReferral} />);
    expect(screen.getByText('High priority')).toBeVisible();
    expect(
      screen.getByText(
        `submitted ${format(
          new Date(priorityMockReferral.createdAt),
          'HH:00 dd MMM'
        )}`
      )
    );
    expect(screen.getByText(`${priorityMockReferral.clients[0]} (referral)`));
    expect(screen.getByText(priorityMockReferral.requestedSupport as string));
    expect(screen.getByText('Make decision'));
    expect(screen.getByText('Assign'));
    expect(screen.getByText('Name of client'));
    expect(screen.getByText('Requested support'));
  });
  it('displays the assign contact modal when the assign button is clicked', () => {
    render(<InitialDecisionCard mashReferral={mockedMashReferral} />);
    fireEvent.click(screen.getByText('Assign'));
    expect(screen.getByText('Assign contact'));
    expect(screen.getByText('Select worker'));
    expect(screen.getByText('Submit'));
    expect(screen.getByText('Cancel'));
  });
});
