export interface ProfileState {
    fullName: string;
    specialty: string;
    district: string;
    address: string;
    rate: string;
    selectedShift: string[];
    selectedDay: string[];
    fromTime: string;
    toTime: string;
    bio: string;
    email: string;
    password: string;
    profileImageFile?: File | null;
}