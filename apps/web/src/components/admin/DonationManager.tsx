import { useState } from "react";
import { Button, Card, Heading, Body } from "../../design-system";

interface Donation {
  id: number;
  donorEmail: string;
  donorName: string;
  amount: string;
  currency: string;
  frequency: string;
  message?: string;
  anonymous: boolean;
  stripePaymentIntentId?: string;
  status: string;
  createdAt: string;
}

interface DonationManagerProps {
  donations: Donation[];
  onRefresh: () => void;
}

export const DonationManager = ({ donations, onRefresh }: DonationManagerProps) => {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDonations = donations.filter(donation => {
    if (filterStatus !== 'all' && donation.status !== filterStatus) return false;
    if (filterFrequency !== 'all' && donation.frequency !== filterFrequency) return false;
    return true;
  });

  const totalDonations = filteredDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
  const completedDonations = filteredDonations.filter(d => d.status === 'completed');
  const totalCompleted = completedDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

  if (selectedDonation) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Heading level={2}>Donation Details</Heading>
          <Button variant="ghost" onClick={() => setSelectedDonation(null)}>
            Back to Donations
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Donation Information</h3>
            <div className="space-y-3">
              <div>
                <Body className="font-medium">Donation ID</Body>
                <Body variant="muted">DN-{selectedDonation.id.toString().padStart(8, '0')}</Body>
              </div>
              <div>
                <Body className="font-medium">Status</Body>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedDonation.status)}`}>
                  {selectedDonation.status}
                </span>
              </div>
              <div>
                <Body className="font-medium">Amount</Body>
                <Body variant="muted" className="text-lg font-semibold">
                  {selectedDonation.currency} {selectedDonation.amount}
                </Body>
              </div>
              <div>
                <Body className="font-medium">Frequency</Body>
                <Body variant="muted">{selectedDonation.frequency}</Body>
              </div>
              <div>
                <Body className="font-medium">Donation Date</Body>
                <Body variant="muted">{new Date(selectedDonation.createdAt).toLocaleString()}</Body>
              </div>
              {selectedDonation.stripePaymentIntentId && (
                <div>
                  <Body className="font-medium">Payment ID</Body>
                  <Body variant="muted" className="font-mono text-xs">{selectedDonation.stripePaymentIntentId}</Body>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Donor Information</h3>
            <div className="space-y-3">
              <div>
                <Body className="font-medium">Name</Body>
                <Body variant="muted">
                  {selectedDonation.anonymous ? 'Anonymous Donor' : selectedDonation.donorName}
                </Body>
              </div>
              <div>
                <Body className="font-medium">Email</Body>
                <Body variant="muted">
                  {selectedDonation.anonymous ? 'Hidden (Anonymous)' : selectedDonation.donorEmail}
                </Body>
              </div>
              <div>
                <Body className="font-medium">Anonymous</Body>
                <Body variant="muted">{selectedDonation.anonymous ? 'Yes' : 'No'}</Body>
              </div>
              {selectedDonation.message && (
                <div>
                  <Body className="font-medium">Message</Body>
                  <Body variant="muted" className="italic">
                    "{selectedDonation.message}"
                  </Body>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Heading level={2}>Donation Management</Heading>
        <Body variant="muted">{filteredDonations.length} donations</Body>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <h3 className="text-sm font-medium text-ink-500">Total Donations</h3>
          <p className="mt-2 text-2xl font-bold">{filteredDonations.length}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-ink-500">Completed</h3>
          <p className="mt-2 text-2xl font-bold">{completedDonations.length}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-ink-500">Total Amount</h3>
          <p className="mt-2 text-2xl font-bold">
            {filteredDonations.length > 0 ? `${filteredDonations[0].currency} ${totalDonations.toFixed(2)}` : 'GHS 0.00'}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-ink-500">Completed Amount</h3>
          <p className="mt-2 text-2xl font-bold">
            {completedDonations.length > 0 ? `${completedDonations[0].currency} ${totalCompleted.toFixed(2)}` : 'GHS 0.00'}
          </p>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded border border-ink-300 px-3 py-2"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Frequency</label>
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="rounded border border-ink-300 px-3 py-2"
            >
              <option value="all">All Frequencies</option>
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
          {(filterStatus !== 'all' || filterFrequency !== 'all') && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setFilterStatus('all');
                setFilterFrequency('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredDonations.map((donation) => (
          <Card key={donation.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div 
              className="flex items-center justify-between"
              onClick={() => setSelectedDonation(donation)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <Body className="font-semibold">
                      Donation DN-{donation.id.toString().padStart(8, '0')}
                    </Body>
                    <Body variant="muted" className="mt-1">
                      {donation.anonymous ? 'Anonymous Donor' : `${donation.donorName} • ${donation.donorEmail}`}
                    </Body>
                    <Body className="mt-1 font-semibold">
                      {donation.currency} {donation.amount} • {donation.frequency}
                    </Body>
                    <Body variant="muted" className="mt-1">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </Body>
                    {donation.message && (
                      <Body variant="muted" className="mt-1 italic">
                        "{donation.message.length > 100 ? donation.message.substring(0, 100) + '...' : donation.message}"
                      </Body>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                    {donation.status}
                  </span>
                  {donation.anonymous && (
                    <div className="mt-1">
                      <span className="px-2 py-1 rounded text-xs bg-ink-100 text-ink-600">
                        Anonymous
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredDonations.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <Body variant="muted">
                {donations.length === 0 ? 'No donations found' : 'No donations match the current filters'}
              </Body>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};