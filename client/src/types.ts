import { z, ZodType } from "zod"; // Add new import

export type CustomResponse = {
  success: boolean;
  message: string;
};

export type FormData = {
  lastName: string;
  firstName: string;
  gender: UserGender;
  email: string;
  password: string;
  date: number;
  month: number;
  year: number;
  OTP?: number;
};

export type UserType = {
  id: string;
  lastName: string;
  firstName: string;
  gender: UserGender;
  email: string;
  password: string;
  role: "admin" | "user";
  phone: number;
  address: string;
  avatar: string;
  cover_picture: string;
  status_id: number;
  describe_yourself: string;
  relationship_id: number;
  date_of_birth: string;
  lastActive: string;
};

export type ChangePasswordType = {
  email?: string;
  password: string;
  confirmPassword?: string;
  confirm?: {
    message: string;
    ref: string | undefined;
    type: string;
  };
};

const emailRegex = /^([a-zA-Z0-9]+)([.{1}])?([a-zA-Z0-9]+)@gmail([.])com$/;
export enum UserGender {
  Male = "male",
  Female = "female",
}
export const RegisterSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be 2 or more characters long" })
    .max(20, "Name is too long"),
  lastName: z
    .string()
    .min(2, { message: "Must be 2 or more characters long" })
    .max(20, "Name is too long"),
  gender: z.enum([UserGender.Male, UserGender.Female]),
  email: z.string().regex(emailRegex, {
    message: "Invalid email format",
  }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  date: z
    .number()
    .min(1, "Date must be at least 1")
    .max(31, "Date must be at most 31"),
  month: z
    .number()
    .min(1, "Month must be at least 1")
    .max(12, "Month must be at most 12"),
  year: z
    .number()
    .min(1900, "Year must be at least 1900")
    .max(2100, "Year must be at most 2100"),
});

export const LoginSchema: ZodType<Pick<FormData, "email" | "password">> =
  z.object({
    email: z.string().regex(emailRegex, {
      message: "Invalid email format",
    }),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

export const ResetPasswordSchema: ZodType<ChangePasswordType> = z
  .object({
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirm"], // path of error
  });

export interface SelectModeType {
  icon: string;
  name: string;
}

export interface listObjectImageType {
  id: number;
  name: File;
}

export interface ImageVideoState {
  isAddImageVideo: boolean;
  showOrHiddenImageVideo: boolean;
  isEditImages: boolean;
  listObjectImage: listObjectImageType[];
  imageList: File[];
}

export interface emojiType {
  slug: string;
  character: string;
  unicodeName: string;
  codePoint: string;
  group: string;
  subGroup: string;
}

export interface postType {
  textPost: string;
  isTagName: boolean;
  isCheckIn: number;
  isChooseGIF: boolean;
  locationTag: dataProvinceType;
  locationList: dataProvinceType[];
}

export interface dataProvinceType {
  id: number;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  latitude: number;
  longitude: number;
}

export interface ProvinceType {
  error: number;
  error_text: string;
  data_name: string;
  data: dataProvinceType[];
}

export interface dataFontType {
  id: number;
  name: string;
  font: string;
}

export interface reelType {
  isCreateText: boolean;
  selectBg: {
    id: number;
    srcImg: string;
  };
  changeFont: dataFontType;
  typeTextReel: string;
}

export interface storyDataType {
  id: string;
  user_id: string;
  video_url?: string;
  thumbnail_url?: string;
  caption?: string;
  mode_privacy: string;
  user?: UserType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface userListStoryType {
  [user_id: string]: storyDataType[];
}

export interface NotificationType {
  user: UserType;
  timeSend: number;
  message: string;
}

export interface conversationType {
  id: string;
  user_id: string;
  conversation_name: string;
  type_conversation: string;
  group_image: string;
  pinned?: boolean;
  unread?: number;
  time?: Date;
}

export interface participantsType {
  conversation_id: string;
  user_id: string;
  joined_at: Date;
}

export interface messageType {
  id: string;
  conversation_id: string;
  type_msg: string;
  sub_type: string;
  user_id?: string;
  message?: string;
  image_url?: string[];
  file_url?: string | null;
  audio_record_url?: string | null;
  send_at: Date;
}

export interface imageCloudinaryType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
}
