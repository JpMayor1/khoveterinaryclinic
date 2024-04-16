import express from "express";
import {
    addFeedback,
    cancelAppointment,
    createAppointment,
    deleteAppointment,
    getAllAppointments,
    getAppointmentById,
    getAppointmentsByClientId,
    getAppointmentsByDate,
    updateAppointment,
    updateAppointmentByClient,
} from "../controllers/AppointmentController";

const appointmentRouter = express.Router();

appointmentRouter.get("/api/appointments", getAllAppointments);
appointmentRouter.get("/api/appointments/:id", getAppointmentById);
appointmentRouter.get(
    "/api/appointments/client/:id",
    getAppointmentsByClientId
);
appointmentRouter.get("/api/appointments/date/:date", getAppointmentsByDate);
appointmentRouter.post("/api/appointments/create", createAppointment);
appointmentRouter.put("/api/appointments/feedback/:id", addFeedback);
appointmentRouter.put("/api/appointments/update/:id", updateAppointment);
appointmentRouter.put(
    "/api/appointments/update/client/:id",
    updateAppointmentByClient
);
appointmentRouter.delete("/api/appointments/cancel/:id", cancelAppointment);
appointmentRouter.delete("/api/appointments/delete/:id", deleteAppointment);

export default appointmentRouter;
