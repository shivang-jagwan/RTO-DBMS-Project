export type Owner = {
  id: string;
  name: string;
}

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
  driver: {
    name: string;
  };
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
