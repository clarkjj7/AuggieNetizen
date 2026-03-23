const express = require('express')
const dotenv = require('dotenv')
const {createClient} = require('@supabase/supabase-js')


dotenv.config()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_ANON_KEY)

const app = express()
app.use(express.json())
app.listen(8081, () => {
    console.log("server is running on port 8081")
})

app.post('/login', async (req,res) => {
    const {email, password} = req.body
    const {data, error} = await supabase.auth.signInWithPassword({email, password})
    if(error){
        return res.status(400).json({error: "Login failed"})
    }
    return res.status(200).json({message: "Login successful"})
})

app.post('/register', async (req,res) => {
    const {email, password} = req.body
    const {data, error} = await supabase.auth.signUp({email, password})
    if(error){
        return res.status(400).json({error: "Sign up failed"})
    }
    return res.status(200).json({message: "Sign up successful"})
})