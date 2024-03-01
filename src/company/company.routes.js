'use strict'

import { Router } from "express"
import {
    validateJwt,
} from '../middlewares/validate-jwt.js';
import {
    testCompany,
    addCompany,
    updateCompany,
    viewCompanies,
    getCompaniesExcel
} from './company.controller.js'

const api = Router()

api.get('/testCompany',[validateJwt], testCompany)
api.post('/addCompany', [validateJwt], addCompany)
api.put('/updateCompany/:id', [validateJwt], updateCompany)
api.get('/viewCompanies',[validateJwt], viewCompanies)
api.get('/excel', [validateJwt], getCompaniesExcel);

export default api