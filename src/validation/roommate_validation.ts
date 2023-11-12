import z from "zod"

export const FindRoommateSchema = z.object({
  name: z
    .string({
      required_error: "room name must be provided",
      invalid_type_error: "room name must be type of string",
    })
    .trim()
    .min(1, "required"),
  location: z
    .string({
      required_error: "location must be provided",
      invalid_type_error: "location must be type of string",
    })
    .trim()
    .min(1, "required"),
  rent: z
    .string({
      required_error: "room rent must be provided",
      invalid_type_error: "room rent must be type of string",
    })
    .trim()
    .min(1, "required")
    .transform(Number),
  ammenities: z
    .string({
      required_error: "ammenities must be provided",
      invalid_type_error: "ammenities must be type of string",
    })
    .trim()
    .min(1, "required"),
  description: z
    .string({
      required_error: "description must be provided",
      invalid_type_error: "description must be type of string",
    })
    .trim()
    .min(1, "required"),
  rules: z
    .string({
      required_error: "rules must be provided",
      invalid_type_error: "rules must be type of string",
    })
    .trim()
    .min(1, "required"),
})

export type IFindRoommateSchema = z.infer<typeof FindRoommateSchema>
