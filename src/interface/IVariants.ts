export interface IVariants {
    id: number;
    lead_time: number;
    rank: number;
    rate: number;
    statistics: any | null;
    status: string;
    properties: {
      is_fast_shipping: boolean;
      is_ship_by_seller: boolean;
      is_multi_warehouse: boolean;
      has_similar_variants: boolean;
      is_rural: boolean;
      in_digikala_warehouse: boolean;
    };
    digiplus: {
      services: string[];
      services_summary: string[];
      service_list: { title: string }[];
      is_jet_eligible: boolean;
      cash_back: number;
      is_general_location_jet_eligible: boolean;
      fast_shipping_text: string;
    };
    warranty: {
      id: number;
      title_fa: string;
      title_en: string;
    };
    color: {
      id: number;
      title: string;
      hex_code: string;
    };
    seller: {
      id: number;
      title: string;
      code: string;
      url: string;
      rating: {
        total_rate: number;
        total_count: number;
        commitment: number;
        no_return: number;
        on_time_shipping: number;
      };
      properties: {
        is_trusted: boolean;
        is_official: boolean;
        is_roosta: boolean;
        is_new: boolean;
      };
      stars: number;
      grade: {
        label: string;
        color: string;
      };
      logo: string | null;
      registration_date: string;
    };
    digiclub: {
      point: number;
    };
    price: {
      selling_price: number;
      rrp_price: number;
      order_limit: number;
      is_incredible: boolean;
      is_promotion: boolean;
      is_locked_for_digiplus: boolean;
      bnpl_active: boolean;
      discount_percent: number;
      is_plus_early_access: boolean;
    };
    shipment_methods: {
      description: string;
      has_lead_time: boolean;
      providers: {
        title: string;
        description: string;
        has_lead_time: boolean;
        type: string;
      }[];
    };
    has_importer_price: boolean;
    manufacture_price_not_exist: boolean;
    has_best_price_in_last_month: boolean;
    buy_box_notices: any[];
    variant_badges: any[];
  }