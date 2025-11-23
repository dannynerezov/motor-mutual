export type SortMode = 'random' | 'price-asc' | 'price-desc';

export interface DatabaseVehicle {
  id: string;
  state: string;
  registration_number: string;
  vehicle_make: string;
  vehicle_model: string | null;
  vehicle_year: number | null;
  vehicle_series: string | null;
  vehicle_variant: string | null;
  market_value: number | null;
  calculated_membership_price: number | null;
  vehicle_image_url: string;
}

export interface DisplayVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  series?: string;
  variant?: string;
  value: number;
  premium: number;
  image: string;
  description: string;
  registrationNumber: string;
  state: string;
}

export const adaptDatabaseVehicle = (dbVehicle: DatabaseVehicle): DisplayVehicle => {
  // Build model string
  const modelParts = [
    dbVehicle.vehicle_model,
    dbVehicle.vehicle_series,
  ].filter(Boolean);
  
  const model = modelParts.join(' ') || 'Unknown Model';

  // Generate description based on vehicle attributes and location
  const stateNames: Record<string, string> = {
    'NSW': 'New South Wales',
    'VIC': 'Victoria',
    'QLD': 'Queensland',
    'WA': 'Western Australia',
    'SA': 'South Australia',
    'TAS': 'Tasmania',
    'ACT': 'Australian Capital Territory',
    'NT': 'Northern Territory',
  };

  const premium = dbVehicle.calculated_membership_price || 0;
  const value = dbVehicle.market_value || 0;
  
  let priceCategory = 'affordable';
  if (premium > 1000) priceCategory = 'premium';
  else if (premium > 700) priceCategory = 'mid-range';

  const stateName = stateNames[dbVehicle.state] || dbVehicle.state;
  const description = `${priceCategory.charAt(0).toUpperCase() + priceCategory.slice(1)} ${dbVehicle.vehicle_make} from ${stateName}, showing our transparent pricing in action.`;

  return {
    id: dbVehicle.id,
    year: dbVehicle.vehicle_year || 2020,
    make: dbVehicle.vehicle_make,
    model,
    series: dbVehicle.vehicle_series || undefined,
    variant: dbVehicle.vehicle_variant || undefined,
    value,
    premium,
    image: dbVehicle.vehicle_image_url,
    description,
    registrationNumber: dbVehicle.registration_number,
    state: dbVehicle.state,
  };
};
