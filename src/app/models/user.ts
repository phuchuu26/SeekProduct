export interface user {
  email: string;
  password: string;
}
export interface profileUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username;
  phone_number: string;
  work_at: string;
  job: string;
  message: string;
  avatar: any;
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
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}
export interface updatePassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface AllMyCompany {
  count: string;
  next: string;
  previous: string;
  results?: Company[];
}
export interface Company{

    id?: number;
    user?: number;
    store_name?: string;
    address?: string;
    phone_number?: string;
    legal_name?: string;
    site?: string;
    logo?: string;
    business_license?: string;
    ad_sample?: any;
    about?: string;
    banner?: string[];
    category?: number[];
    productgroup?: {
      id: number;
      name?: string;
      info?: string;
      company?: number;
    }[];
    social_link?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
    status?: string;
    is_subscribed?: boolean;
    social_status?: boolean;

}

export interface Category{
  id?: number;
  name?: string;
  info?: string;
}
export interface AccountBtok{
  country?:string;
  name?:string;
  routing?:number;
  account?:string;
}
