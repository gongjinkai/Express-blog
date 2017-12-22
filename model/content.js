var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var contentSchema = new Schema({
    uid: String,
    name: String,
    title: String,
    content: String,
    createTime: {
        type: String,
        default: moment(new Date).format('YYYY-MM-DD HH:mm:ss')
    }
})

exports.Demo = mongoose.model('demo',contentSchema);