export const formatAppointmentTime = (timeString: string) => {
    const [hours, minutes] = timeString.replace(/[^\d:]/g, "").split(":");
    const isPM = timeString.toLowerCase().includes("pm");

    let hours24 = parseInt(hours, 10);
    if (isPM && hours24 !== 12) {
        hours24 += 12;
    } else if (!isPM && hours24 === 12) {
        hours24 = 0;
    }

    const formattedTime = new Date();
    formattedTime.setHours(hours24, parseInt(minutes, 10), 0, 0);

    return formattedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};
