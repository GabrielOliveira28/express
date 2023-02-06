const express = require('express')
const path = require('path')
const fs = require('fs')


const app = express()

app.set('view engine', 'ejs')



// ARQUIVOS ESTÁTICOS
// app.use(express.static(path.join(__dirname, 'views')))

// DEFININDO ARQUIVOS PÚBLICOS
app.use(express.static(path.join(__dirname, 'public')))

// HABILITANDO SERVER PARA RECEBER DADOS VIA POST (FORMULÁRIO)
app.use(express.urlencoded({ extended: true}))



// ROTAS
app.get('/', (req, res) => {

    const BoxJson = fs.readFileSync('./store/produtos.json')
    const contentBox = JSON.parse(BoxJson)

    res.render('index', {
        title: 'Site - Home',
        contentBox
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Site - About'
    })
})

app.get('/posts', (req, res) => {
    const{c} = req.query

    const postsJson = fs.readFileSync('./store/posts.json')
    const newPosts = JSON.parse(postsJson)

    res.render('posts', {
        title: 'Site - Posts',
        newPosts,
        cadastrado: c,
    })
})


// ROTA POST
app.post('/salvar-post', (req, res) => {
    const {nome, texto} = req.body

    const data = fs.readFileSync('./store/posts.json')
    const posts = JSON.parse(data)

    posts.push({
        nome,
        texto,
    })

    const postsString = JSON.stringify(posts)
    fs.writeFileSync('./store/posts.json', postsString)

    res.redirect('/posts?c=1')
})



// NOT FOUND 404
app.use((req, res) => { // MIDLEWARE
    res.send('Not Found')
})



// SERVIDOR
const port = process.env.port || 8080

app.listen(port, () => {
    console.log(`server is listen on port ${port}`)
})