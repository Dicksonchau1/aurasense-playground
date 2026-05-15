import React from 'react';
import { render, screen } from '@testing-library/react';
import PartnerIntegrationSection from '../../src/components/integrations/PartnerIntegrationSection';
import { partnerAdapterRegistry } from '../../src/lib/integrations/registry';
import { mockAdapter } from '../../backend/service/integrations/mockAdapter';

beforeAll(() => {
  partnerAdapterRegistry.register(mockAdapter);
});

describe('PartnerIntegrationSection', () => {
  it('renders integration section', async () => {
    render(<PartnerIntegrationSection />);
    expect(await screen.findByText(/Partner Integrations/)).toBeInTheDocument();
    expect(await screen.findByText(/Mock Partner/)).toBeInTheDocument();
  });
});
