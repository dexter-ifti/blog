import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import {sign} from 'hono/jwt'
import {signinSchema, signupSchema} from '@ifti_taha/common'



export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    }

}>();


userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const {success}  = signupSchema.safeParse(body);

    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())



    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name,
            },
        })
        const token = await sign({ id: user.id }, c.env.JWT_SECRET);

        return c.json({
            jwt: token,
            message : 'User created'
        })
    } catch (error) {
        c.status(411);
        console.log(error);
        
        return c.json({ message: 'User already exists' });
    }
})

userRouter.post('/signin', async (c) => {
    const body = await c.req.json();

    const { success } = signinSchema.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())


    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            }
        });
    
        if (user?.password !== body.password) {
            c.status(403);
            return c.json({ message: 'Invalid credentials' });
        }
    
        const jwt = await sign({ id: user?.id }, c.env.JWT_SECRET);
        return c.json({ jwt });
    } catch (error) {
        console.log(error);
        c.status(411);
        return c.text('Invalid');
        
    }
})



