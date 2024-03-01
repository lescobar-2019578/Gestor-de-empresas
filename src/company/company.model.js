import { Schema, model } from 'mongoose';

const companySchema = Schema({
    name: {
        type: String,
        required: true
    },
    levelImpact: {
        type: String,
        required: true
    },
    yearsExp: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }
},{
    versionKey: false
})

export default model('company', companySchema)
