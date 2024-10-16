import express from "express"
import path from "path"
import __dirname from "./utils.js"
import ProductManager from "./dao/ProductManager.js"
import CartManager from "./dao/CartManager.js"

const PORT = 3000
const productsFilePath = path.join(__dirname,"data","products.json")
const productManager = new ProductManager(productsFilePath)
const cartFilePath = path.join(__dirname,"data","carts.json")
const cartManager = new CartManager(cartFilePath)

const app = express()

app.use(express.json()) 
app.use(express.urlencoded({extended:true}))

app.get("/",(req, res)=>{
    res.send("API Productos - Home Page")
})

app.get("/productos", async (req, res)=>{
    try {
        let productos=await productManager.getProducts()
        // console.log(productos)
        res.status(200).send(productos)
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.get("/productos/:pid", async (req, res)=>{
    
    // let pid = Number(req.params.pid)
    let {pid} = req.params
    pid = Number(pid)

    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let producto=await productManager.getProductById(pid)
        // console.log(producto)
        if (!producto){
            return res.status(404).send({ERROR:`product of id ${pid} NOT FOUND.`})
        }

        return res.status(200).send(producto)

    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.post("/productos", async (req, res)=>{
    let {title, description, code, price, status, stock, category, thumbnail} = req.body
    // Validar que ninguno de los campos llegue vacio
    if (!title || !description || !code || !price || !status|| !stock|| !category || !thumbnail){
        return res.status(400).send({ERROR:`Missing required fields. ${req.body}`})
    }

    try {
        let productos = await productManager.getProducts()
        // Validar que no se repita el campo “code”
        if (productos.find(prod => prod.code === code)){
            return res.status(400).send({ERROR:`Product code ${code} already exists.`})
        }

        await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail)

        return res.status(201).send({CONFIRMATION:"Product added successfully"})

    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."}) 
    }

})

app.delete("/productos/:pid", async (req, res)=>{
    // let pid = Number(req.params.pid)
    let {pid} = req.params
    pid = Number(pid)

    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let product = await productManager.getProductById(pid)
        if (!product){
            return res.status(404).send({ERROR:`product of id ${pid} NOT FOUND.`})
        }
        await productManager.deleteProduct(pid)
        return res.status(200).send({CONFIRMATION:"Product deleted!"})

    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.put("/productos/:pid", async (req, res)=>{
    let {pid} = req.params
    pid = Number(pid)

    let productos = await productManager.getProducts()
    let product = productos.find(prod => prod.id === pid)
    let fields = req.body

    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    if (!product){
        return res.status(404).send({ERROR:`product of id ${pid} NOT FOUND.`})
    }
    
    try {
        await productManager.updateProduct(pid, fields)
        return res.status(200).send({CONFIRMATION:`Product ${pid} updated!`})
    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }

})

//////////// cart routes /////////////////////////////

app.post("/cart", async (req, res)=>{
    try {
        await cartManager.createCart()
        return res.status(200).send({CONFIRMATION:"CART CREATED."})
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.get("/cart", async (req, res)=>{ 
    try {
        let cart = await cartManager.getCarts()
        // console.log(productos)
        res.status(200).send(cart)
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.get("/cart/:cid", async (req, res)=>{
    
    let {cid} = req.params
    let id = Number(cid)

    if (isNaN(id)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let cart = await cartManager.getCartById(id)
        if (!cart){
            return res.status(404).send({ERROR:`cart of id ${cid} NOT FOUND.`})
        }
        res.status(200).send(cart)
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.post("/cart/:cid/product/:pid", async (req, res)=>{
    
    let {cid, pid} = req.params
    cid = Number(cid)
    pid = Number(pid)

    if (isNaN(cid)){
        return res.status(400).send({ERROR:"cart id must be number."})
    }
    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let cart = await cartManager.getCartById(cid)
        if (!cart){
            return res.status(404).send({ERROR:`cart id ${cid} NOT FOUND.`})
        }

        let product = await productManager.getProductById(pid)
        if (!product){
            return res.status(404).send({ERROR:`product id ${pid} NOT FOUND.`})
        }

        await cartManager.addOrderToCart(cid, pid)
        
        return res.status(200).send({CONFIRMATION:"Order Saved."})
        
    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }
})



app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`)
    // console.log(`Reading:  ${filePath}`)
})