import fs from "fs"

export default class ProductManager{
    #path = ""
    constructor(filePath){
        this.#path = filePath 
    } 
    
    async getProducts(){
        let check_file = fs.existsSync(this.#path)
        if (check_file) {
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        } else {
            return []
        }
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnail){
        let productos = await this.getProducts()
        
        let id=1
        if(productos.length>0){
            id=productos[productos.length - 1].id + 1
        }

        let newProduct = {id, title, description, code, price, status, stock, category, thumbnail}

        productos.push(newProduct)
        
        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 4))

        return newProduct
    }


    async #checkProductID(productID){
        let productos = await this.getProducts()
        return productos.findIndex(prod => prod.id === productID)
    }

    async getProductById(productID){
        //buscar en el arreglo el producto que coincida con el id, si no, error::NOT FOUND
        let productos = await this.getProducts()
        let productIndex = await this.#checkProductID(productID)
        if (productIndex === -1){
            return 
        }
        return productos[productIndex]
    }

    async updateProduct(productID, newFields){
        let productos = await this.getProducts()
        let product = productos.find(prod => prod.id === productID)

        if ('id' in newFields) {
            delete newFields.id; // Ignora el cambio de id
        }
        Object.assign(product, newFields)
        
        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 4))

        return product
    }

    async deleteProduct(productID){
        let productos = await this.getProducts()
        productos = productos.filter(prod => prod.id !== productID)
        
        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 4))

        return productos
    }
}