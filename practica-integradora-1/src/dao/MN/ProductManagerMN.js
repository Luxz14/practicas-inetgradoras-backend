import { productModel } from "../models/products.models.js";

export class ProductManagerMN {
    constructor(){
        this.model = productModel
    }

    async getProducts(){
        try {
            return await this.model.find({})   
        } catch (error) {
            console.error("Error al mostrar los productos, intentalo de nuevo", error);
        }
    }

    async getProduct(pid){
        return await this.model.findOne({_id: pid})
    }

    async addProduct(newProduct){
        return await this.model.create(newProduct)
    }

    async updateProduct(pid, updatedProduct){
        return await this.model.updateOne({_id: pid}, updatedProduct)
    }

    async deleteProduct(pid){
        return await this.model.deleteOne({_id: pid})
    }
}
