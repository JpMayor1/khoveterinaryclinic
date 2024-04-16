export const formatPhoneNumber = (phoneNumber: string): string => {
    if (phoneNumber.startsWith("63")) {
        return `0${phoneNumber.substring(2)}`;
    }
    return phoneNumber;
};
