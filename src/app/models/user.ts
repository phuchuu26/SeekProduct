export interface user {
  email: string;
  password: string;
}
export interface profileUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone_number: string;
  work_at: string;
  job: string;
  message: string;
  avatar: string;
  show_phone: boolean;
  country: string;
  stripe_customer_id: string;
  city: string;
  vat_number: string;
  twitter: string;
  facebook: string;
  google: string;
  linkedin: string;
}

export interface registerAccount {
  first_name:string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}
