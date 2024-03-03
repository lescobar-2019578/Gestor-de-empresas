'use strict'

import Company from './company.model.js'
import { checkUpdate } from '../utils/validator.js'
import ExcelJS from 'exceljs';

export const testCompany = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const addCompany = async (req, res) => {
    try {
        let data = req.body
        console.log(data)
        let company = new Company(data)
        await company.save()
        return res.send({ message: `Registered Company` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering company', err: err })
    }
}

export const updateCompany = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'You have sent data that cannot be updated' })
        let updateCompany = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateCompany) return res.status(404).send({ message: 'Company not found and not updated' })
        return res.send({ message: 'Company updated', updateCompany })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating the company' })
    }
}


export const viewCompanies = async (req, res) => {
    try {
        let { sortBy, sortOrder, filterByYears, filterByCategory } = req.query;

        let query = {};

        // Filtrar por años de trayectoria
        if (filterByYears) {
            query.yearsOfExperience = filterByYears;
        }

        // Filtrar por categoría
        if (filterByCategory) {
            query.category = filterByCategory;
        }

        // Ordenar por nombre de la compañía (A-Z por defecto)
        let sortOptionAZ = { name: 1 };

        // Si se proporciona un parámetro de orden, ajustar el criterio de ordenamiento
        if (sortBy && sortOrder) {
            sortOptionAZ[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        let companies = await Company.find(query).sort(sortOptionAZ);
        return res.send({ companies });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error trying to fetch companies', err: err });
    }
}

export const getCompaniesExcel = async (_req, res) => {
    try {
        // Obtener las empresas
        let companies = await Company.find().populate('category', ['name', 'description']);

        // Crea el libro de excel
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Companies');

        // Pone los encabezados de cada columna con formato
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Years of Experience', key: 'yearsExp', width: 20 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Description', key: 'description', width: 100 }
        ];

        // Aplicar estilos a los encabezados de columna
        worksheet.getRow(1).eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFA500' } // Color de fondo naranja
            };
            cell.font = { bold: true }; // negrita
        });

        // bordes de la tabla
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
            row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Agregar datos de empresas al documento Excel
        companies.forEach(company => {
            worksheet.addRow({
                name: company.name,
                yearsExp: company.yearsExp,
                category: company.category.name,
                description: company.category.description
            });
        });

        // Pasar el documento Excel en un archivo
        let filePath = 'companies.xlsx';
        await workbook.xlsx.writeFile(filePath);
        res.attachment(filePath);

        // Enviar el archivo
        res.send();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching companies and generating Excel', err: err });
    }
}


