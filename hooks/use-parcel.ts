import { useCallback, useState } from "react";


/**
 * Custom hook to manage parcel details
 */
export function useParcelDetails() {
  const [details, setDetails] = useState({
    parcelWeight: 0,
    packagingType: "",
    specialRequirements: "",
    pickupContactName: "",
    pickupContactPhone: "",
    deliveryContactName: "",
    deliveryContactPhone: "",
    selectedPickupPoint: "",
    selectedDeliveryPoint: "",
  });

  const updateParcelDetails = useCallback(
    (updates: Partial<typeof details>) => {
      setDetails((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  return { parcelDetails: details, updateParcelDetails };
}