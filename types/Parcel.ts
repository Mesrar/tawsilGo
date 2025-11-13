export interface ParcelDetailsFormProps {
    selectedTrip: any;
    parcelWeight: number;
    setParcelWeight: (weight: number) => void;
    packagingType: string; // Add this line
    setPackagingType: (type: string) => void; // Add this line
    selectedPickupPoint: string;
    setSelectedPickupPoint: (point: string) => void;
    selectedDeliveryPoint: string;
    setSelectedDeliveryPoint: (point: string) => void;
    specialRequirements: string;
    setSpecialRequirements: (req: string) => void;
    pickupContactName: string;
    setPickupContactName: (name: string) => void;
    pickupContactPhone: string;
    setPickupContactPhone: (phone: string) => void;
    deliveryContactName: string;
    setDeliveryContactName: (name: string) => void;
    deliveryContactPhone: string;
    setDeliveryContactPhone: (phone: string) => void;
    handleBooking: (formData?: any) => void;
    isBooking: boolean;
    goBack?: () => void;
    user?: any; // Add user prop for auto-fill functionality
  }


  // Define type for parcel details
export interface ParcelDetails {
  departure: string;
  destination: string;
  weight: number;
  packagingType: string;
  specialRequirements?: string;
  senderDetails: {
    name: string;
    phone: string;
  };
  receiverDetails: {
    name: string;
    phone: string;
  };
}
  
  export type ParcelFormState = {
    // Parcel details
    parcelWeight: number;
    packagingType: string;
    specialRequirements: string;
    
    // Contact information
    pickupContactName: string;
    pickupContactPhone: string;
    deliveryContactName: string;
    deliveryContactPhone: string;
    
    // Locations
    selectedPickupPoint: string;
    selectedDeliveryPoint: string;
    
    // Search filters
    departureCityFilter?: string;
    destinationCityFilter?: string;
    dateFilter?: Date;
    heroFromCountry?: string;
    heroToCountry?: string;
  };