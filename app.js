import fetch from 'node-fetch';
import express from 'express';
const app = express();
import { Server } from 'socket.io';
import { createServer } from 'http';
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg) => {
        // handle the msg here
        console.log('message: ' + msg);
    });
});

const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', 'views');

app.listen(port, console.log(`Listening on ${port}`));

app.get('/products/search', async (req, response) => {
    if (req.query.hasOwnProperty('q')) {
        let results = await fetch('https://dummyjson.com/products/search?q=' + req.query.q)
            .then(res => res.json())
            .then(res => response.render('search', { products: res.products, categories: null }));
    }

});
app.get('/products', async (req, response) => {

    let results = await fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(res => response.render('products', { products: res.products, categories: null }));


});

app.get('/:prod_id([0-9]{0,10})', async (req, response) => {
    let categories = await fetch('https://dummyjson.com/products/categories').then(res => res.json()).then(res => res.slice(0, 9));
    if (req.params.prod_id) {
        fetch('https://dummyjson.com/products/' + req.params.prod_id)
            .then(res => res.json())
            .then(res => response.render('productdetails', { products: res, categories: categories }));
    }
    else {
        fetch('https://dummyjson.com/products/')
            .then(res => res.json())
            .then(res => response.render('index', { products: res.products, categories: categories }));
    }
});

// app.get(['/:category'], async (req, response) => {
//     let categories = await fetch('https://dummyjson.com/products/categories').then(res => res.json()).then(res => res.slice(0, 9));
//     fetch('https://dummyjson.com/products/category/' + req.params.category)
//         .then(res => res.json())
//         .then(res => response.render('products', { products: res.products, categories: categories, currentCate: req.params.category }));
// });
app.get('/products/category/:category', async (req, response) => {

    let category = req.params.category;
    var response = await fetch('https://dummyjson.com/products/category/' +category)
        .then(res => res.json())
        .then(res => response.render('catogry', { products: res.products, categories: null }));

});
