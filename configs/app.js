import express from 'express'
import { config } from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import userRouter from '../src/user/user.routes.js'
import companyRouter from '../src/company/company.routes.js'
import categoryRoutes from  '../src/category/category.routes.js'

const app = express()
config()
const port = process.env.PORT 

// Middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

// Routes
app.use('/user', userRouter)
app.use('/company', companyRouter)
app.use('/category', categoryRoutes)

export const initServer = () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}
