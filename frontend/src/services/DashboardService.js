import api from "../api/axios";

export const getSummary = () => api.get("/dashboard/summary");

export const getCategory = () => api.get("/dashboard/category");

export const getPriority = () => api.get("/dashboard/priority");

export const getTeam = () => api.get("/dashboard/team");

export const getAllTickets = () => api.get("/tickets");

export const createTicket = (ticket) => api.post("/tickets", ticket);
