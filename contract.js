'use strict'
var Comment = function (messageId, commentId, sender, content) {
  this.messageId = messageId
  this.commentId = commentId
  this.sender = sender
  this.content = content
}

var CommentMap = function () {
  this.data = []
}

var Message = function (messageId, sender, content) {
  this.messageId = messageId
  this.sender = sender
  this.content = content
}

var MessageBoardContract = function () {
  LocalContractStorage.defineMapProperty(this, messages)
  LocalContractStorage.defineMapProperty(this, comments)
  LocalContractStorage.defineMapProperty(this, commentMap)
  LocalContractStorage.defineProperties(this, {
    messageCount: null,
    commentCount: null
  })
}

MessageBoardContract.prototype = {
  init: function () {
    this.messageCount = 0
    this.commentCount = 0
  },

  getMessageCount: function () {
    return this.messageCount
  },

  getMessage: function (index) {
    if (index > this.messageCount) {
      throw new Error()
    }
    return this.messages.get(index)
  },

  addMessage: function (content) {
    messageId = this.messageCount + 1
    messageCount+=1
    msg = new Message(messageId , Blockchain.transaction.from, content)
    this.messages.put(messageId, msg);
    return messageId;
  }

}

module.exports = MessageBoardContractc
