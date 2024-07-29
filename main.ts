import { z } from "zod";

// Section 1: basic example
enum Hobbies {
  READING = "reading",
  WRITING = "writing",
  CODING = "coding",
}

const arrayEnum = ["aaa", "bbb", "ccc"] as const;

const kk = arrayEnum[0];

// Note: Each Generated Type need its own schema
// Note: Schema default filter out extra keys, passThrough() or strict() to control this
const geoSchema = z.object({
  coords: z.tuple([z.number(), z.number(), z.number()]),
});

const tupleSchema = z
  .object({
    custom: z.tuple([z.date(), z.string()]).rest(z.number()),
  })
  .optional();

type TupleSchemaType = z.infer<typeof tupleSchema>;

const UserSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string().min(5),
    age: z.number().gt(18),
    birthday: z.date().optional(),
    friends: z.array(z.string()).nullish(),
    literal: z.literal("hello").optional(),
    random: z.number().default(Math.random),
    isNew: z.boolean().default(false),
    hobbies: z.array(z.nativeEnum(Hobbies)).nonempty().min(2).max(3),
    jj: z.any(),
  })
  .merge(geoSchema)
  .extend({ tuple: tupleSchema });

type UserSchemaType = z.infer<typeof UserSchema>;

const UserPartialSchema = UserSchema.partial();

type UserPartialSchemaType = z.infer<typeof UserPartialSchema>;

const UserSelectionSchema = UserSchema.pick({
  name: true,
  age: true,
});

type UserSelectionSchemaType = z.infer<typeof UserSelectionSchema>;

// Example here
const apiUser = { name: "dddddd", age: 19, jj: 12 };

const getUserWithDefaults = (user: UserPartialSchemaType): UserSchemaType => {
  return {
    ...user,
    id: "123",
    age: user.age || 18,
    name: user.name || "default",
    random: Math.random(),
    isNew: true,
    hobbies: [Hobbies.CODING, Hobbies.READING],
    coords: [0, 0, 0],
  };
};
const userWithDefaults: UserSchemaType = getUserWithDefaults(apiUser); // Note: missing default values

// Section 1 - Output
console.log(
  "checking UserSchema.safeParse(userWithDefaults).error --->",
  UserSchema.safeParse(userWithDefaults).error
);
// console.log(UserSchema.safeParse(userWithDefaults).data);

// Section 2: Object Types

// console.log("checking shape---->", UserSchema.shape.name);

// Section 3: Record Types
const demoMapSchema = z.record(z.string(), z.number());
type DemoMapSchemaType = z.infer<typeof demoMapSchema>;
