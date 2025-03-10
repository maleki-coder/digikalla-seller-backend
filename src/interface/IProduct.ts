import { IVariants } from "./IVariants";

export interface Product {
    id: number;
    title_fa: string;
    title_en: string;
    url: {
      base: null;
      uri: string;
    };
    status: string;
    has_quick_view: boolean;
    data_layer: {
      brand: string;
      category: string;
      metric6: number;
      dimension2: number;
      dimension6: number;
      dimension7: string;
      dimension9: number;
      dimension11: number;
      dimension20: string;
      item_category2: string;
      item_category3: string;
      item_category4: string;
      item_category5: string;
    };
    product_type: string;
    test_title_fa: string;
    test_title_en: string;
    digiplus: {
      services: string[];
      services_summary: string[];
      service_list: Array<{
        title: string;
      }>;
      is_jet_eligible: boolean;
      cash_back: number;
      is_general_location_jet_eligible: boolean;
      fast_shipping_text: null;
    };
    images: {
      main: {
        storage_ids: any[];
        url: string[];
        thumbnail_url: null;
        temporary_id: null;
        webp_url: string[];
      };
      list: Array<{
        storage_ids: any[];
        url: string[];
        thumbnail_url: null;
        temporary_id: null;
        webp_url: string[];
      }>;
    };
    rating: {
      rate: number;
      count: number;
    };
    colors: any[];
    default_variant: any[];
    properties: {
      is_fast_shipping: boolean;
      is_ship_by_seller: boolean;
      free_shipping_badge: boolean;
      is_multi_warehouse: boolean;
      is_fake: boolean;
      has_gift: boolean;
      min_price_in_last_month: number;
      is_non_inventory: boolean;
      is_ad: boolean;
      ad: any[];
      is_jet_eligible: boolean;
      is_medical_supplement: boolean;
      has_printed_price: boolean;
    };
    badges: any[];
    has_true_to_size: boolean;
    product_badges: any[];
    videos: any[];
    category: {
      id: number;
      title_fa: string;
      title_en: string;
      code: string;
      content_description: string;
      content_box: string;
      return_reason_alert: string;
    };
    brand: {
      id: number;
      code: string;
      title_fa: string;
      title_en: string;
      url: {
        base: null;
        uri: string;
      };
      visibility: boolean;
      logo: {
        storage_ids: any[];
        url: string[];
        thumbnail_url: null;
        temporary_id: null;
        webp_url: null;
      };
      is_premium: boolean;
      is_miscellaneous: boolean;
      is_name_similar: boolean;
    };
    review: {
      description: string;
      short_review: string;
      attributes: Array<{
        title: string;
        values: string[];
      }>;
    };
    pros_and_cons: {
      advantages: string[];
      disadvantages: string[];
    };
    suggestion: {
      count: number;
      percentage: number;
    };
    variants: IVariants[];
    second_default_variant: any[];
    questions_count: number;
    comments_count: number;
    comments_overview: any[];
    breadcrumb: Array<{
      title: string;
      url: {
        base: null;
        uri: string;
      };
    }>;
    has_size_guide: boolean;
    specifications: Array<{
      title: string;
      attributes: Array<{
        title: string;
        values: string[];
      }>;
    }>;
    expert_reviews: {
      attributes: any[];
      description: string;
      short_review: string;
      admin_rates: any[];
      review_sections: any[];
      technical_properties: {
        advantages: string[];
        disadvantages: string[];
      };
    };
    meta: {
      brand_category_url: {
        base: null;
        uri: string;
      };
    };
    last_comments: any[];
    last_questions: any[];
    tags: any[];
    digify_touchpoint: string;
    show_type: string;
    has_offline_shop_stock: boolean;
    st_cmp_tacker: {
      neo: string;
      cx: string;
      dx: string;
      "data-fx": string;
      zero: string;
    };
  }