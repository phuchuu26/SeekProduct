export interface Subscription{
    company_id: number;
    plan_id: string;
    trial_period_days: string;
    company : {
        id: number;
        store_name: string;
        phone_number: string;
        logo: string;
        address: string;
    };
    plan : {
        id: number;
        price : number;
        name: string;
    }
}