const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const LnkSchema = new mongoose.Schema({
    title: String,
    lid: {type: String, unique: true, index: true},
    lnk: String
});


const Lnk = mongoose.model('Lnk', LnkSchema);


module.exports = Lnk;

