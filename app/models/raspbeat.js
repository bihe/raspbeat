/**
 * document model
 */
'use strict';

var mongoose = require('mongoose');
var randomstring = require('randomstring');
var Schema = mongoose.Schema;

var raspSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title cannot be blank'
  },
  alternativeId: {
    type: String,
    trim: true
  },
  ip: {
    type: String,
    trim: true,
    required: 'IP address cannot be blank'
  },
  created: {
		type: Date,
		default: Date.now
	},
  localTimestamp: {
    type: Date,
    default: Date.now
  },
  load: {
    type: String
  }
});

// add some Middleware magic
raspSchema.pre('save', function (next) {
  if(!this.alternativeId || this.alternativeId === '') {
		// create and set an alternative id
		this.alternativeId = randomstring.generate(8);
  }
  next();
});

raspSchema.methods.toString = function() {
	return '[title: ' + this.title + ', IP: ' + this.ip + ' (id: ' + this._id +', alternativeId: ' + this.alternativeId + ')]';
};

module.exports = mongoose.model('Raspbeat', raspSchema);
