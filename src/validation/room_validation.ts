import z from "zod"

export const CreateRoomSchema = z.object({
  location: z
    .string({
      required_error: "room location must be provided",
      invalid_type_error: "room location must be type of string",
    })
    .trim()
    .min(1),
  name: z
    .string({
      required_error: "room name must be provided",
      invalid_type_error: "room name must be type of string",
    })
    .trim()
    .min(1),
  rent: z
    .string({
      required_error: "room rent must be provided",
      invalid_type_error: "room rent must be type of string",
    })
    .transform(Number),
  ammenities: z
    .string({
      required_error: "ammenities must be provided",
      invalid_type_error: "ammenities must be type of string",
    })
    .trim(),
  description: z
    .string({
      required_error: "description must be provided",
      invalid_type_error: "description must be type of string",
    })
    .trim()
    .min(1),
  rules: z
    .string({
      required_error: "rules must be provided",
      invalid_type_error: "rules must be type of string",
    })
    .min(1)
    .trim(),
})

export type ICreateRoomSchema = z.infer<typeof CreateRoomSchema>
