export interface IFetchProductResponseDto {
    status: number;
    data: {
      product: Product;
      data_layer: {
        event: string;
        ecommerce: {
          detail: {
            actionField: {
              list: string;
            };
            products: ProductDetail[];
          };
        };
      };
      seo: {
        title: string;
        description: string;
        twitter_card: {
          title: string;
          image: string;
          price: number;
          description: string;
        };
        open_graph: {
          title: string;
          url: string;
          image: string;
          availability: string;
          type: string;
          site: string;
          price: number;
          description: string;
        };
        header: {
          title: string;
          description: string;
          canonical_url: string;
        };
        markup_schema: Array<
          | {
              "@type": string;
              "@context": string;
              name: string;
              alternateName: string;
              image: string[];
              description: string;
              mpn: number;
              sku: number;
              category: string;
              brand: {
                "@type": string;
                name: string;
                url: string;
                "@id": string;
              };
              aggregateRating: {
                "@type": string;
                ratingValue: number;
                reviewCount: number;
              };
              offers: {
                "@type": string;
                priceCurrency: string;
                price: number;
                itemCondition: string;
                availability: string;
              };
              review: null;
            }
          | Array<{
              "@context": string;
              "@type": string;
              itemListElement: Array<{
                "@type": string;
                position: number;
                name: string;
                item:
                  | {
                      "@type": string;
                      "@id": string;
                    }
                  | string;
              }>;
            }>
        >;
      };
      intrack: {
        eventName: string;
        eventData: {
          currency: string;
          deviceType: string;
          name: string;
          productId: number;
          productImageUrl: string[];
          quantity: null;
          leafCategory: string;
          unitPrice: null;
          url: string;
          supplyCategory: string;
          categoryLevel1: string;
          categoryLevel2: string;
          categoryLevel3: string;
          categoryLevel4: string;
          categoryLevel5: string;
        };
        userId: null;
      };
      landing_touchpoint: any[];
      dynamic_touch_points: any[];
      promotion_banner: {
        product_promotion: {
          background: string;
          aspect_ratio: string;
        };
        dkjet_promotion: null;
      };
      bigdata_tracker_data: {
        page_name: string;
        page_info: {
          product_id: number;
        };
      };
      dynamic_pdp_carousel: any[];
    };
  }
  export interface Variants {
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
  
  interface Product {
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
    variants: Variants[];
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
  
  interface ProductDetail {
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
    name: string;
    id: number;
    price: null;
    metric8: number;
    dimension3: string;
    dimension10: null;
    dimension15: number;
    metric15: number;
    metric11: number;
    metric12: number;
  }
  