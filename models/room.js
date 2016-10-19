var mongoose = require('mongoose');
var RoomSchema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        required: true
    },
    rules: {
        type: String,
        required: true
    },
    timelimit: {
        type: Number,
        required: true
    },
    invited: {
        type: Array,
        required: true
    },
    joined: {
        type: Array
    },
    finished: {
        type: Array
    },
    public: {
        type: Boolean
    }
});

var Room = mongoose.model('Room', RoomSchema);

module.exports = Room;