"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { vehicleService } from "@/app/services/vehicleService";
import { VehicleType, VehicleRegistrationRequest } from "@/types/vehicle";
import {
    Plus,
    Loader2,
    Car,
    Truck,
    Upload,
    X,
    FileText,
    Image as ImageIcon,
} from "lucide-react";

interface RegisterVehicleDialogProps {
    onVehicleRegistered?: () => void;
    trigger?: React.ReactNode;
}

const VEHICLE_TYPES: { value: VehicleType; label: string; icon: React.ReactNode }[] = [
    { value: "motorcycle", label: "Motorcycle", icon: <Car className="w-4 h-4" /> },
    { value: "car", label: "Car", icon: <Car className="w-4 h-4" /> },
    { value: "van", label: "Van", icon: <Truck className="w-4 h-4" /> },
    { value: "truck", label: "Truck", icon: <Truck className="w-4 h-4" /> },
    { value: "bus", label: "Bus", icon: <Truck className="w-4 h-4" /> },
];

export function RegisterVehicleDialog({ onVehicleRegistered, trigger }: RegisterVehicleDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Form state
    const [vehicleType, setVehicleType] = useState<VehicleType>("car");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [color, setColor] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [maxWeight, setMaxWeight] = useState<number>(500);

    // Document state
    const [registrationDoc, setRegistrationDoc] = useState<File | null>(null);
    const [insuranceDoc, setInsuranceDoc] = useState<File | null>(null);
    const [inspectionDoc, setInspectionDoc] = useState<File | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);

    const resetForm = () => {
        setVehicleType("car");
        setBrand("");
        setModel("");
        setYear(new Date().getFullYear());
        setColor("");
        setLicensePlate("");
        setMaxWeight(500);
        setRegistrationDoc(null);
        setInsuranceDoc(null);
        setInspectionDoc(null);
        setPhotos([]);
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            resetForm();
        }
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (file: File | null) => void
    ) => {
        const file = e.target.files?.[0] || null;
        setter(file);
    };

    const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setPhotos((prev) => [...prev, ...files].slice(0, 5)); // Max 5 photos
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!brand.trim()) {
            toast({ title: "Brand required", description: "Please enter the vehicle brand.", variant: "destructive" });
            return;
        }
        if (!model.trim()) {
            toast({ title: "Model required", description: "Please enter the vehicle model.", variant: "destructive" });
            return;
        }
        if (!licensePlate.trim()) {
            toast({ title: "License plate required", description: "Please enter the license plate.", variant: "destructive" });
            return;
        }
        if (!registrationDoc) {
            toast({ title: "Registration document required", description: "Please upload the registration document (carte grise).", variant: "destructive" });
            return;
        }
        if (!insuranceDoc) {
            toast({ title: "Insurance document required", description: "Please upload the insurance document.", variant: "destructive" });
            return;
        }

        try {
            setIsSubmitting(true);

            const data: VehicleRegistrationRequest = {
                type: vehicleType,
                brand: brand.trim(),
                model: model.trim(),
                year,
                color: color.trim() || undefined,
                licensePlate: licensePlate.trim().toUpperCase(),
                capacity: {
                    weight: { min: 0, max: maxWeight, recommended: Math.floor(maxWeight * 0.8) },
                    volume: { min: 0, max: 10 },
                    dimensions: { length: 200, width: 150, height: 150 },
                },
                features: [],
                documents: {
                    registration: registrationDoc,
                    insurance: insuranceDoc,
                    inspection: inspectionDoc || undefined,
                    photos: photos.length > 0 ? photos : undefined,
                },
            };

            const response = await vehicleService.registerVehicle(data);

            if (response.success) {
                toast({
                    title: "Vehicle registered",
                    description: "Your vehicle has been successfully registered and is pending verification.",
                });
                queryClient.invalidateQueries({ queryKey: ["driver-vehicles"] });
                setOpen(false);
                resetForm();
                onVehicleRegistered?.();
            } else {
                throw new Error(response.error?.message || "Failed to register vehicle");
            }
        } catch (error) {
            console.error("Failed to register vehicle:", error);
            toast({
                title: "Registration failed",
                description: error instanceof Error ? error.message : "Failed to register vehicle. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        Add Vehicle
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Register New Vehicle</DialogTitle>
                    <DialogDescription>
                        Enter your vehicle details and upload required documents.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Vehicle Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Vehicle Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Vehicle Type</Label>
                                <Select value={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VEHICLE_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex items-center gap-2">
                                                    {type.icon}
                                                    {type.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand *</Label>
                                <Input
                                    id="brand"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    placeholder="e.g., Toyota"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="model">Model *</Label>
                                <Input
                                    id="model"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder="e.g., Hiace"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                                    min={1990}
                                    max={new Date().getFullYear() + 1}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <Input
                                    id="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="e.g., White"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="licensePlate">License Plate *</Label>
                                <Input
                                    id="licensePlate"
                                    value={licensePlate}
                                    onChange={(e) => setLicensePlate(e.target.value)}
                                    placeholder="e.g., 12345-A-67"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxWeight">Max Capacity (kg) *</Label>
                            <Input
                                id="maxWeight"
                                type="number"
                                value={maxWeight}
                                onChange={(e) => setMaxWeight(parseInt(e.target.value) || 500)}
                                min={50}
                                max={50000}
                                required
                            />
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Documents</h3>

                        {/* Registration Document */}
                        <div className="space-y-2">
                            <Label>Registration Document (Carte Grise) *</Label>
                            <div className="flex items-center gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                                        registrationDoc
                                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                            : "border-slate-300 hover:border-blue-400 dark:border-slate-700"
                                    }`}>
                                        {registrationDoc ? (
                                            <>
                                                <FileText className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-green-700 dark:text-green-400 truncate">
                                                    {registrationDoc.name}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-500">Click to upload</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, setRegistrationDoc)}
                                    />
                                </label>
                                {registrationDoc && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setRegistrationDoc(null)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Insurance Document */}
                        <div className="space-y-2">
                            <Label>Insurance Document *</Label>
                            <div className="flex items-center gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                                        insuranceDoc
                                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                            : "border-slate-300 hover:border-blue-400 dark:border-slate-700"
                                    }`}>
                                        {insuranceDoc ? (
                                            <>
                                                <FileText className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-green-700 dark:text-green-400 truncate">
                                                    {insuranceDoc.name}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-500">Click to upload</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, setInsuranceDoc)}
                                    />
                                </label>
                                {insuranceDoc && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setInsuranceDoc(null)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Technical Inspection (Optional) */}
                        <div className="space-y-2">
                            <Label>Technical Inspection (Optional)</Label>
                            <div className="flex items-center gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-colors ${
                                        inspectionDoc
                                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                            : "border-slate-300 hover:border-blue-400 dark:border-slate-700"
                                    }`}>
                                        {inspectionDoc ? (
                                            <>
                                                <FileText className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-green-700 dark:text-green-400 truncate">
                                                    {inspectionDoc.name}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-500">Click to upload</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, setInspectionDoc)}
                                    />
                                </label>
                                {inspectionDoc && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setInspectionDoc(null)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Vehicle Photos (Optional) */}
                        <div className="space-y-2">
                            <Label>Vehicle Photos (Optional, max 5)</Label>
                            <div className="space-y-2">
                                <label className="cursor-pointer">
                                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg border-slate-300 hover:border-blue-400 dark:border-slate-700 transition-colors">
                                        <ImageIcon className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-500">Click to add photos</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handlePhotosChange}
                                        disabled={photos.length >= 5}
                                    />
                                </label>
                                {photos.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {photos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="relative group bg-slate-100 dark:bg-slate-800 rounded-lg p-2 flex items-center gap-2"
                                            >
                                                <ImageIcon className="w-4 h-4 text-slate-500" />
                                                <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[100px]">
                                                    {photo.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(index)}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                            </>
                        ) : (
                            "Register Vehicle"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
