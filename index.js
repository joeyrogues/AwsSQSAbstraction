



const MessageQueue = require('./MessageQueue')
const Q = new MessageQueue({
  QUEUE_URL: process.env.QUEUE_URL
})

const wait = (t, forward) => new Promise((resolve) => setTimeout(() => resolve(forward), t || 0))

const transform = (body) => Object.keys(body).reduce((acc, key) => {
  switch (body[key].DataType) {
    case 'String':
      acc[key] = body[key].StringValue
      break
    case 'Number':
      acc[key] = parseInt(body[key].StringValue, 10)
      break
    default:
      throw new Error('Bad DataType')
  }

  return acc
}, {})

Q.sendMessage({
  MessageBody: 'user:create:' + Date.now(),
  MessageAttributes: {
    'firstname': { DataType: 'String', StringValue: 'Joey' },
    'lastname' : { DataType: 'String', StringValue: 'Plop' },
    'age'      : { DataType: 'Number', StringValue: '27'   }
  }
})
.then((data) => wait(1000, data))
.then((data) => {
  console.log('MessageId', data.MessageId)
  console.log('_______________________________________________________________\n')

  return Q.receiveMessage({
    MessageAttributeNames: [ 'firstname', 'lastname', 'age' ]
  })

})
.then((data) => wait(1000, data))
.then((data) => {
  if (!data.Messages || !data.Messages.length) {
    return null
  }

  const message = data.Messages[0]
  console.log('Body', message.Body)
  console.log('MessageAttributes', message.MessageAttributes)
  console.log('_______________________________________________________________\n')

  return Q.deleteMessage(data.Messages[0]).then((data) => {
    console.log('RequestId', data.ResponseMetadata.RequestId)
    console.log('_______________________________________________________________\n')

  })

}).catch((err) => {
  console.error(err)

})
