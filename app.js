const express = require("express"),
      app = express(),
      mongoose = require('mongoose'),
      Lnk = require("./lnk"),
      bodyParser = require('body-parser'),
      paginate = require('paginatejson');

      
app.use(bodyParser.json());

require('dotenv').config();

const dbPwd = process.env.DB_PWD;
try{
    mongoose.connect(`mongodb+srv://omar:${dbPwd}@cluster0-a65kl.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology:true});
    console.log("connected to database...");
}
catch(e){
    console.log("Can't connect to database. \n" + e.message);
}




app.post('/', async (req, res) => {

    let link = {
        title: req.body.title,
        lid: req.body.lid,
        lnk: req.body.lnk
    }

    link = new Lnk(link);
    
    try{
        await link.save();
    }
    catch(e) {
        return res.status(500).send(e.message);
    }

    res.send(link);
});

app.get('/all/:page?',async (req, res) => {
    const page = req.params.page || 1;
    let lnks;
    try {
        lnks = await Lnk.find();
    }
    catch(e) {
        return res.status(500).send(e.message);
    }

    if(!lnks)
        return res.status(404).send("no links found!");
    
    res.send(paginate.paginate(lnks, page, 10));

});

app.get('/:lid',async (req, res) => {
    const lnkid = req.params.lid;
    let lnk;
    console.log("searching for " + lnkid);
    try{
        lnk = await Lnk.findOne({lid: lnkid});
    }
    catch(e) {
        return res.status(500).send(e.message);
    }

    if(!lnk)
        return res.status(404).send('link not found!');

    console.log("redirecting to " + lnk.lnk)

    res.writeHead(301,
        {Location: lnk.lnk}
      );
    res.end();
});

app.delete('/:lid', async (req, res) => {
    const lnkid = req.params.lid;
    if(lnkid === 'all' || lnkid === 'All') {
        try {
            await Lnk.deleteMany({});
        }
        catch(e) {
            return res.status(500).send(e.message);
        }

        res.send("All urls are deleted successfully! :)");
    }

    try{
        await Lnk.deleteOne({lid: lnkid});
    }
    catch(e) {
        return res.status(500).send(e.message);
    }
    return res.send("URL "+lnkid+" deleted successfully!");
});

app.put('/:lid', async (req, res) => {
    
    let newLnk = {
        title: req.body.title,
        lid: req.body.lid,
        lnk: req.body.lnk
    };


    try {
        lnk = await Lnk.find({lid: req.params.lid});
    }
    catch(e) {
        return res.status(500).send(e.message);
    }

    if(!lnk)
        return res.status(404).send("link not found!");
    
    try{
        lnk = await Lnk.findOneAndUpdate({lid: req.params.lid}, newLnk);
    }
    catch(e) {
        return res.status(500).send(e.message);
    }

    res.send(lnk);
});

app.get('/query/:lid', async (req, res) => {
    const lnkid = req.params.lid;
    let lnk;
    console.log("searching for " + lnkid);
    try{
        lnk = await Lnk.findOne({lid: lnkid});
    }
    catch(e) {
        return res.status(500).send(e.message);
    }

    if(!lnk)
        return res.status(404).send('link not found!');


    res.send(lnk);
});


const port = process.env.PORT | 3000;

app.listen(port, ()=>console.log(`Listening on ${port}...`));
