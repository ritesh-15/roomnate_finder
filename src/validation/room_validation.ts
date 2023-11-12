import z from "zod"

export const CreateRoomSchema = z.object({
  location: z
    .string({
      required_error: "room location must be provided",
      invalid_type_error: "room location must be type of string",
    })
    .trim()
    .min(1, "required"),
  name: z
    .string({
      required_error: "room name must be provided",
      invalid_type_error: "room name must be type of string",
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

export type ICreateRoomSchema = z.infer<typeof CreateRoomSchema>

export const UpdateRoomSchema = z.object({
  location: z
    .string({
      required_error: "room location must be provided",
      invalid_type_error: "room location must be type of string",
    })
    .trim()
    .min(1, "required")
    .optional(),
  name: z
    .string({
      required_error: "room name must be provided",
      invalid_type_error: "room name must be type of string",
    })
    .trim()
    .min(1, "required")
    .optional(),
  rent: z
    .string({
      required_error: "room rent must be provided",
      invalid_type_error: "room rent must be type of string",
    })
    .trim()
    .min(1, "required")
    .transform(Number)
    .optional(),
  ammenities: z
    .string({
      required_error: "ammenities must be provided",
      invalid_type_error: "ammenities must be type of string",
    })
    .trim()
    .min(1, "required")
    .optional(),
  description: z
    .string({
      required_error: "description must be provided",
      invalid_type_error: "description must be type of string",
    })
    .trim()
    .min(1, "required")
    .optional(),
  rules: z
    .string({
      required_error: "rules must be provided",
      invalid_type_error: "rules must be type of string",
    })
    .trim()
    .min(1, "required")
    .optional(),
})

export type IUpdateRoomSchema = z.infer<typeof UpdateRoomSchema>
