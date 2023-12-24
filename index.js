const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, './tempelates')
const publicPath = path.join(__dirname, './public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



 /* app.get('/home', (req, res) => {
     res.render('home')
 }) */

 app.post('/signup', async (req, res) => {
    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            // User details already exist
            return res.send("User details already exist");
        } else {
            // User details don't exist, save them
            const data = {
                name: req.body.name,
                password: req.body.password
            };

            await LogInCollection.create(data);
        }

        // Send a success response after the user details are processed
        res.status(201).render("home", {
            naming: req.body.name
        });
    } catch (error) {
        // Handle errors, and send an error response
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})



app.listen(port, () => {
    console.log('port connected');
})