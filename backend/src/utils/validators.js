import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be atleast 2 character').max(60,'Name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be 8 character')
        .regex(/[A-Z]/, 'Must contain atleast one uppercase letter')
        .regex(/[0-9]/, 'Must contain atleast one number')
})

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(422).json({
            error: 'Validation failed',
            fields: result.error.flatten().fieldErrors,
        });
    }
    req.body = result.data;  // Use sanitised, parsed data
    next();
};