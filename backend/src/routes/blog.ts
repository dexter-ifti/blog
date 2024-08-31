import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from 'hono/jwt'



export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();


blogRouter.use('/*', async (c, next) => {
    const header = c.req.header('authroization') || "";

    const token = header.split(' ')[1];
    try {
        const user = await verify(token, c.env.JWT_SECRET);
    
        if (user) {
            c.set('userId', user.id as string);
            await next();
        } else {
            c.status(403)
            return c.json({ message: 'Unauthorized' });
        }
    } catch (error) {
        c.status(403)
        return c.json({ message: 'Unauthorized' });
    }

})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();


    const authorId = c.get('userId');

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())


    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: authorId
        }
    })


    return c.json({ 
        id : post.id 
    })
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())


    const post = await prisma.post.update({
        where  :{
            id : body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })


    return c.json({
        id: post.id
    })
})


blogRouter.get('/bulk', async (c) => {


    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const post = await prisma.post.findMany();

        return c.json({
            post
        })
    } catch (error) {
        c.status(411);
        return c.json({ message: 'Post not found' });
    }
})

blogRouter.get('/:id', async (c) => {
    const id =  c.req.param('id');

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const post = await prisma.post.findFirst({
            where: {
                id: id
            }
        })

        return c.json({
            post
        })
    } catch (error) {
        c.status(411);
        return c.json({ message: 'Post not found' });
    }
   
})

