export type RegisterDriverRequest = {
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    vehicleType: 'car' | 'van' | 'truck';
    licenseNumber: string;
    operatingZones: string[];
    address: string;
    vehicleCapacity: number;
  };


  // types/VerificationCode.ts
export type VerificationCode = {
  code_verification: string;
  email: string
};