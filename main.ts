import { z } from "zod";
import { fromZodError } from "zod-validation-error";

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

// Error handling Example:
const demoTestUser: UserSchemaType = {
  id: "123",
  name: "John",
  age: 13,
  friends: null,
  hobbies: [Hobbies.CODING, Hobbies.READING],
  coords: [0, 0, 0],
  random: Math.random(),
  isNew: true,
};

const safeParseResult = UserSchema.safeParse(demoTestUser);

if (safeParseResult.success) {
  console.log(UserSchema.safeParse(demoTestUser).data);
} else {
  console.log('fromZodError =.= =.= =.=');
  console.log(fromZodError(safeParseResult.error));
}

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
// console.log(
//   "checking UserSchema.safeParse(userWithDefaults).error --->",
//   UserSchema.safeParse(userWithDefaults).error
// );


// Section 2: Object Types

// console.log("checking shape---->", UserSchema.shape.name);

// Section 3: Record Types
const demoRecordSchema = z.record(
  z.string(),
  z.object({ name: z.string(), age: z.number() })
);
type DemoRecordSchemaType = z.infer<typeof demoRecordSchema>;

const demoMapSchema = z.map(
  z.string(),
  z.object({ name: z.string(), age: z.number() })
);
type DemoMapSchemaType = z.infer<typeof demoMapSchema>;

const demoMapObj: DemoMapSchemaType = new Map([
  ["id-john", { name: "John", age: 20 }],
  ["id-doe", { name: "Doe", age: 30 }],
]);

// console.log("checking demoMapObj---->", demoMapObj);

const demoSetSchema = z
  .set(z.union([z.string(), z.number()]))
  .min(2)
  .max(3);
type DemoSetSchemaType = z.infer<typeof demoSetSchema>;
const validSet: DemoSetSchemaType = new Set(["a", "b", 1, 2]);
// console.log(
//   "checking demoSetSchema.safeParse(validSet).error --->",
//   demoSetSchema.safeParse(validSet).error
// );

// Section 4: Promise Types
const PromiseSchema = z.promise(
  z.object({ id: z.union([z.string(), z.number()]), name: z.string() })
);

// const PromiseAwaitedSchema = z.await(PromiseSchema)

type PromiseSchemaType = z.infer<typeof PromiseSchema>;

const promiseDemoObj: PromiseSchemaType = Promise.resolve({
  id: "123",
  name: "John",
});

// Section 5: Custom Types
const brandEmailSchema = z
  .string()
  .email()
  .refine((val) => val.endsWith("@ptxmarkets.com"), {
    message: "emaill need to end with @ptxmarkets.com",
  });

const testEmail = "ddd@ptxmarkets.com";

// console.log(
//   "checking brandEmailSchema.safeParse(testEmail).error --->",
//   brandEmailSchema.safeParse(testEmail).error?.issues
// );
