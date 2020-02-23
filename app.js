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

    res.send("Hello World!");
});

app.get('/all/:page?',async (req, res, next) => {
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
    
    res.send(paginate.paginate(lnks, page, 2));

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

app.delete('/del/:lid', async (req, res) => {
    const lnkid = req.params.lid;
    if(lnkid === 'all' || lnkid === 'All') {
        try {
            await Lnk.remove({});
        }
        catch(e) {
            return res.status(500).send(e.message);
        }

        
    }
    let lnk;
    try{
        await Lnk.deleteMany({lid: lnkid});
    }
    catch(e) {
        return res.status(500).send(e.message);
    }
    return res.send("done!");
});

app.put('/update/:lid', async (req, res) => {
    const body = req.body;
    let lnk = {
        title: body.title,
        lid: body.lid,
        lnk: body.lnk
    };
    
    try{
        lnk = await Lnk.updateOne({lid: req.params.lid}, lnk);
    }
    catch(e) {
        return res.status(500).send(e.message);
    }

    if(lnk.n === 0)
        return res.status(404).send("link not found!");



    res.send("Done");
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



app.listen(3000, ()=>console.log("Listening on 3000..."));
