const express = require('express')
const dotenv = require('dotenv')
const {createClient} = require('@supabase/supabase-js')


dotenv.config()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_ANON_KEY)

const app = express()
app.use(express.json())

app.listen(3030, () => {
    console.log("server is running on port 3030")
})

app.use(express.static("public"));

app.post('/login', async (req,res) => {
    const email = String(req.body.email || '').toLowerCase().trim()
    const password = String(req.body.password || '')
    const {data, error} = await supabase.auth.signInWithPassword({email, password})
    if(error){
        return res.status(400).json({error: error.message})
    }
    return res.status(200).json({message: "Login successful"})
})

app.post('/register', async (req,res) => {
    const email = String(req.body.email || '').toLowerCase().trim()
    const password = String(req.body.password || '')
    const {data, error} = await supabase.auth.signUp({email, password})
    if(error){
        return res.status(400).json({error: error.message})
    }

    if (data && data.user) {
        const { error: userError } = await supabase
          .from("users")
          .insert({
            email: data.user.email,
            enabled: true
          });
        if (userError) {
          return res.status(400).json({ error: userError.message });
        }
      }
    return res.status(200).json({message: "Sign up successful"})
})