export interface MeProfileShape {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
}
