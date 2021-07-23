import api from "./api.client";
import { BaseApiResponseModel } from "../shared/models/api/base-api-response.model";
import { ApiAuthModel, ApiUserIdModel } from "shared/models/api/api-auth.model";

export const signIn = (
  email: string,
  password: string
): Promise<BaseApiResponseModel<ApiAuthModel>> =>
  api.post("/auth/sign-in", { email, password });

export const signUp = (
  email: string,
  password: string,
  passwordConfirmation: string,
  firstName: string,
  lastName: string,
  companyName: string,
  jobTitle: string
): Promise<BaseApiResponseModel<ApiAuthModel>> =>
  api.post("/auth/sign-up", {
    email,
    password,
    password_confirmation: passwordConfirmation,
    firstName,
    lastName,
    companyName,
    jobTitle,
  });

export const sendRecoveryLink = (
  email: string
): Promise<BaseApiResponseModel<string>> =>
  api.post("/auth/reset-password", { email });

export const checkRecoveryToken = (
  token: string
): Promise<BaseApiResponseModel<ApiUserIdModel>> =>
  api.get(`/auth/reset-password/${token}`);

export const resetPassword = (
  userId: string,
  token: string,
  password: string,
  passwordConfirmation: string
): Promise<BaseApiResponseModel<string>> =>
  api.post(`/auth/reset-password/${userId}/${token}`, {
    password,
    password_confirmation: passwordConfirmation,
  });
