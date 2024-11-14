import { z } from "zod";
const emailRegex = /^([a-zA-Z0-9]+)([.{1}])?([a-zA-Z0-9]+)@gmail([.])com$/;
const UserGender = Object.freeze({
  Male: "male",
  Female: "female",
});

const userRegisterSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be 2 or more characters long" })
    .max(20, "Name is too long"),
  lastName: z
    .string()
    .min(2, { message: "Must be 2 or more characters long" })
    .max(20, "Name is too long"),
  email: z.string().regex(emailRegex, {
    message: "Invalid email format",
  }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  gender: z.enum([UserGender.Male, UserGender.Female]),
  date_of_birth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

const userLoginSchema = z.object({
  email: z.string().regex(emailRegex, {
    message: "Invalid email format",
  }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const userForgetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(new RegExp("^[\\w\\.]*@(?:gmail\\.com)$")),
});

export { userRegisterSchema, userLoginSchema, userForgetPasswordSchema };
