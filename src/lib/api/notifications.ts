/* eslint-disable @typescript-eslint/no-explicit-any */

import instance from "@/services/axios";

// Handle responses and errors
const handleResponse = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(response.data.message || "Request failed");
};

const handleError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.error || "Request failed");
  } else if (error.request) {
    throw new Error("No response received from the server");
  } else {
    throw new Error(error.message || "Request failed");
  }
};

export const getNotifications = async () => {
  try {
    const response = await instance.get(`/notifications`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getUnreadNotificationCounts = async () => {
  try {
    const response = await instance.get(`/notifications/unread-count`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const markAsRead = async (id: string) => {
  try {
    const response = await instance.patch(`/notifications/${id}/read`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await instance.post(`/notifications/read-all`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
