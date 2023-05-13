import z from "zod"

export const RegisterSchema = z.object({
  name: z
    .string({
      required_error: "name should be provided!",
      invalid_type_error: "name should be valid!",
    })
    .trim()
    .min(2, "name must be two character long"),
  location: z
    .string({
      required_error: "location should be provided!",
      invalid_type_error: "location should be valid!",
    })
    .trim()
    .min(2, "name must be two character long"),
  email: z
    .string({
      required_error: "email should be provided!",
      invalid_type_error: "email should be valid!",
    })
    .trim()
    .email("email should be valid!"),
  password: z
    .string({
      required_error: "password should be provided!",
      invalid_type_error: "password should be valid!",
    })
    .trim()
    .min(6, "password must be at least 6 characters"),
})

export type IRegisterSchema = z.infer<typeof RegisterSchema>

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "email should be provided!",
      invalid_type_error: "email should be valid!",
    })
    .trim()
    .email("email should be valid!"),
  password: z
    .string({
      required_error: "password should be provided!",
      invalid_type_error: "password should be valid!",
    })
    .trim()
    .min(6, "password must be at least 6 characters"),
})

export type ILoginSchema = z.infer<typeof LoginSchema>

export const UpdateProfileScheam = z.object({
  name: z
    .string({
      required_error: "name should be provided!",
      invalid_type_error: "name should be valid!",
    })
    .trim()
    .min(2, "name must be two character long"),
  location: z
    .string({
      required_error: "location should be provided!",
      invalid_type_error: "location should be valid!",
    })
    .trim()
    .min(2, "location must be two character long"),
  phone: z
    .string()
    .trim()
    .min(10, "phone number must be valid")
    .max(10, "phone number must be valid")
    .optional(),
  about: z.string().trim().optional(),
})

export type IUpdateProfileScheam = z.infer<typeof UpdateProfileScheam>
