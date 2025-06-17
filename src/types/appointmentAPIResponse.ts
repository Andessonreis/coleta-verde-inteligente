interface AppointmentAPIResponse {
  id: string | number;
  scheduled_at: string;
  wasteItem?: {
    type: string;
  };
  status: string;
}