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

// Authentication (checks the token on protected routes) 
 
async function authenticate(req, res, next) {
    const token = req.headers['authorization']?.replace('Bearer ', '')
    if (!token) return res.status(401).json({error: 'Missing auth token'})
 
    const {data: {user}, error} = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({error: 'Invalid token'})
 
    req.user = user
    next()
}
 
// Incidents section
 
// gets every  incidents
app.get('/incidents', async (req, res) => {
    const {data, error} = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', {ascending: false})
 
    if (error) return res.status(500).json({error: error.message})
    return res.status(200).json({incidents: data})
})
 
// this will create a new incident ( you have to be  be logged in)
app.post('/incidents', authenticate, async (req, res) => {
    const {type, title, description, lat, lng, address, severity} = req.body
 
    const {data, error} = await supabase
        .from('incidents')
        .insert([{
            type,
            title,
            description,
            lat,
            lng,
            address,
            severity: severity || 'medium',
            status: 'unverified',
            reported_by: req.user.id
        }])
        .select()
        .single()
 
    if (error) return res.status(500).json({error: error.message})
    return res.status(201).json(data)
})
 
// Alerts
 
// this will get all active alerts
app.get('/alerts', async (req, res) => {
    const {data, error} = await supabase
        .from('alerts')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', {ascending: false})
 
    if (error) return res.status(500).json({error: error.message})
    return res.status(200).json({alerts: data})
})
 