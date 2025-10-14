export type Owner = {
  id: string;
  name: string;
}

export type Driver = {
  id: string;
  name: string;
}

export type Vehicle = {
  id: string;
  reg_no: string;
  model: string;
  color: string;
  owner_name: string;
  status: 'Active' | 'Inactive';
};

export type Violation = {
  id: string;
  vehicle_reg_no: string;
  driver_name: string;
  violation_type: string;
  fine: number;
  status: 'Paid' | 'Unpaid';
  date: string;
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
