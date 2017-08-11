



const AWS = require('aws-sdk')

const sqs = new AWS.SQS({
	apiVersion: '2012-11-05',
	region: process.env.REGION
})

const Queue = function (params) {
	params = params || {}

	this.QUEUE_URL = params.QUEUE_URL
}

Queue.prototype._getUrl = function () {
	return this.QUEUE_URL
}

Queue.prototype.sendMessage = function (config) {
	return new Promise((resolve, reject) => {
		config = config || {}
		config.QueueUrl = this._getUrl(),
	  config.DelaySeconds = 0

		sqs.sendMessage(config, (err, data) => err && reject(err) || resolve(data))
	})
}

Queue.prototype.receiveMessage = function (config) {
	return new Promise((resolve, reject) => {
		config = config || {}
		config.QueueUrl = this._getUrl()

	  sqs.receiveMessage(config, (err, data) => err && reject(err) || resolve(data))
	})
}

Queue.prototype.deleteMessage = function (message) {
	return new Promise((resolve, reject) => {
		sqs.deleteMessage({
		  QueueUrl: this._getUrl(),
		  ReceiptHandle: message.ReceiptHandle
		}, (err, data) => err && reject(err) || resolve(data))
	})
}

module.exports = Queue
