import { render, screen } from '@testing-library/react';
import MashTags from './MashTags';
import { mashReferralFactory } from 'factories/mashReferral';
import { ReferralStage } from 'types';
import MockDate from 'mockdate';
import { subHours, subMinutes } from 'date-fns';

describe('MashTags', () => {
  beforeEach(() => {
    MockDate.reset();
  });
  it('should show time since referral was recieved when the referral is in contact stage', () => {
    MockDate.set('2021-01-01');
    const contactMockReferral = mashReferralFactory.build({
      stage: ReferralStage.CONTACT,
      createdAt: subHours(new Date(), 2).toISOString(),
    });
    render(<MashTags mashReferral={contactMockReferral} />);
    expect(screen.getByText('2 hours ago'));
  });
  it.only('should show time (in minutes) since referral was recieved when the referral is in contact stage', () => {
    MockDate.set('2021-01-01');
    const contactMockReferral = mashReferralFactory.build({
      stage: ReferralStage.CONTACT,
      createdAt: subMinutes(new Date(), 5).toISOString(),
    });
    render(<MashTags mashReferral={contactMockReferral} />);
    expect(screen.getByText('5 mins ago'));
  });
  it('should show time since referral was recieved when the referral is in initial decision stage', () => {
    MockDate.set('2021-01-01');
    const initialMockReferral = mashReferralFactory.build({
      stage: ReferralStage.INITIAL,
      createdAt: subHours(new Date(), 2).toISOString(),
    });
    render(<MashTags mashReferral={initialMockReferral} />);
    expect(screen.getByText('2 hours ago'));
  });
  it('should show time (in minutes) since referral was recieved when the referral is in initial decision stage', () => {
    MockDate.set('2021-01-01');
    const initialMockReferral = mashReferralFactory.build({
      stage: ReferralStage.INITIAL,
      createdAt: subMinutes(new Date(), 5).toISOString(),
    });
    render(<MashTags mashReferral={initialMockReferral} />);
    expect(screen.getByText('5 mins ago'));
  });
  it('should show time left to make screening decision on the referral when the case has a green rag rating (72 hour window)', () => {
    MockDate.set('2021-01-01');
    const screeningMockReferral = mashReferralFactory.build({
      stage: ReferralStage.SCREENING,
      initialDecision: 'EH screening required in MASH',
      createdAt: subHours(new Date(), 48).toISOString(),
    });
    render(<MashTags mashReferral={screeningMockReferral} />);
    expect(screen.getByText('24 hours left'));
  });
  it('should show time left to make screening decision on the referral when the case has a amber rag rating (24 hour window)', () => {
    MockDate.set('2021-01-01');
    const screeningMockReferral = mashReferralFactory.build({
      stage: ReferralStage.SCREENING,
      initialDecision: 'CSC screening required in MASH',
      createdAt: subHours(new Date(), 2).toISOString(),
    });
    render(<MashTags mashReferral={screeningMockReferral} />);
    expect(screen.getByText('22 hours left'));
  });
  it('should show time left to make screening decision on the referral when the case has a red rag rating (4 hour window)', () => {
    MockDate.set('2021-01-01');
    const screeningMockReferral = mashReferralFactory.build({
      stage: ReferralStage.SCREENING,
      initialDecision: 'Progress straight to CSC allocation',
      createdAt: subHours(new Date(), 2).toISOString(),
    });
    render(<MashTags mashReferral={screeningMockReferral} />);
    expect(screen.getByText('2 hours left'));
  });
  it('should show time left to make final decision on the referral when the case has a green rag rating (72 hour window)', () => {
    MockDate.set('2021-01-01');
    const finalMockReferral = mashReferralFactory.build({
      stage: ReferralStage.FINAL,
      initialDecision: 'EH screening required in MASH',
      createdAt: subHours(new Date(), 48).toISOString(),
    });
    render(<MashTags mashReferral={finalMockReferral} />);
    expect(screen.getByText('24 hours left'));
  });
  it('should show time left to make final decision on the referral when the case has a amber rag rating (24 hour window)', () => {
    MockDate.set('2021-01-01');
    const finalMockReferral = mashReferralFactory.build({
      stage: ReferralStage.FINAL,
      initialDecision: 'CSC screening required in MASH',
      createdAt: subHours(new Date(), 2).toISOString(),
    });
    render(<MashTags mashReferral={finalMockReferral} />);
    expect(screen.getByText('22 hours left'));
  });
  it('should show time left to make final decision on the referral when the case has a red rag rating (4 hour window)', () => {
    MockDate.set('2021-01-01');
    const finalMockReferral = mashReferralFactory.build({
      stage: ReferralStage.SCREENING,
      initialDecision: 'Progress straight to CSC allocation',
      createdAt: subHours(new Date(), 2).toISOString(),
    });
    render(<MashTags mashReferral={finalMockReferral} />);
    expect(screen.getByText('2 hours left'));
  });
});
