export type Driver = {
  driverid: string;
  name: string;
  contact?: string;
  phonenumber?: string;
  address?: string;
}

export type Vehicle = {
  vehicleid: string;
  regno: string;
  make: string;
  model: string;
  color: string;
  driver: Driver;
};

export type Violation = {
  violationid: string;
  violationtype: string;
  fineamount: number;
  paymentstatus: 'Paid' | 'Unpaid';
  occurdate: string;
  vehicle: Vehicle | null;
};

export type DashboardStats = {
  totalVehicles: number;
  pendingChallans: number;
  totalFineCollected: number;
  violationsToday: number;
};

export type ChartData = {
  paid: number;
  unpaid: number;
};

export type TopOffender = {
  driverid: string;
  name: string;
  contact: string;
  violation_count: number;
};
