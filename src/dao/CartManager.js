import fs from "fs"

export default class CartManager{
    #path = ""
    #cart = []
    constructor(filePath){
        this.#path = filePath 
    } 

    async getCarts(){
        let check_file = fs.existsSync(this.#path)
        if (check_file) {
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        } else {
            return []
        }
    }

    async #checkCartID(cartID){
        let carts = await this.getCarts()
        return carts.findIndex(cart => cart.id === cartID)
    }

    async getCartById(cartID){
        let carts = await this.getCarts()
        let cartIndex = await this.#checkCartID(cartID)
        if (cartIndex === -1){
            return 
        }
        return carts[cartIndex]
    }

    async createCart() {
        let id=1
        if(this.#cart.length>0){
            id=this.#cart[this.#cart.length - 1].id + 1
        }
        let orders = []

        this.#cart.push({id:id,products:orders})

        await fs.promises.writeFile(this.#path, JSON.stringify(this.#cart, null, 4))
        return this.#cart
    }

    async addOrderToCart(cartID, productID){
        let carts = await this.getCarts()
        let cart = await this.getCartById(cartID)
        let quantity = 1
        
        let prodInCart = cart.products.find(prod => prod.product === productID)
        if (prodInCart){
            cart.products.forEach(prod => {
                if (prod.product === productID){
                    ++prod.quantity 
                }             
            });
        } else {
            cart.products.push({product:productID,quantity:quantity})
        }

        console.log(cart)
        
        //cart.products.product === productoID ---> cart.products.quantity += 1
        carts[cartID-1] = cart
        
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 4))
        return
    }
}
