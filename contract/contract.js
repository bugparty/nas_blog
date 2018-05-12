'use strict'

var Comment = function (text) {
  if (text) {
    var o = JSON.parse(text)
    this.messageId = o.messageId
    this.sender = o.sender
    this.content = o.content
    this.commentId = o.commentId
  } else {
    this.messageId = 0
    this.sender = ''
    this.content = ''
    this.commentId = 0
  }
}

Comment.prototype = {
  toString: function () {
    return JSON.stringify(this)
  }
}

var CommentMap = function (text) {
  if (text) {
    var o = JSON.parse(text)
    this.data = o.data
  } else {
    this.data = []
  }
}

CommentMap.prototype = {
  toString: function () {
    return JSON.stringify(this)
  },
  count: function () {
    return this.data.length
  },
  gets: function () {
    return this.data
  },
  add: function (commentId) {
    this.data.push(commentId)
    return { 'commentIds': this.data }
  }
}

var Message = function (text) {
  if (text) {
    var o = JSON.parse(text)
    this.messageId = o.messageId
    this.sender = o.sender
    this.content = o.content
  } else {
    this.messageId = 0
    this.sender = ''
    this.content = ''
  }
}

Message.prototype = {
  toString: function () {
    return JSON.stringify(this)
  }
}

var MessageBoardContract = function () {
  LocalContractStorage.defineMapProperty(this, 'messages', {
    parse: function (text) {
      return new Message(text)
    },
    stringify: function (o) {
      return o.toString()
    }
  })
  LocalContractStorage.defineMapProperty(this, 'comments', {
    parse: function (text) {
      return new Comment(text)
    },
    stringify: function (o) {
      return o.toString()
    }
  })
  LocalContractStorage.defineMapProperty(this, 'commentMap', {
    parse: function (text) {
      return new CommentMap(text)
    },
    stringify: function (o) {
      return o.toString()
    }
  })

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
    return this.messages.get(index)
  },

  getMessages: function (offset, limit) {
    var messages = []

    if (offset > this.messageCount) {
      return {
        'error': 'offset too big',
        'messages': null
      }
    } else {
      if (limit + offset > this.messageCount) {
        limit = this.messageCount - offset
      }
      for (var i = offset; i < limit + offset; i++) {
        messages.push(this.messages.get(i))
      }
      return { 'error': null,
        'messages': messages }
    }
  },

  addMessage: function (content) {
    var messageId = this.messageCount + 1
    this.messageCount += 1
    var msg = new Message()
    msg.messageId = messageId
    msg.sender = Blockchain.transaction.from
    msg.content = content
    this.messages.put(messageId, msg)
    this.commentMap.put(messageId, new CommentMap())
    console.log('in addMessage ' + this.commentMap)
    return messageId
  },

  addComment: function (messageId, content) {
    var commentId = this.commentCount + 1
    this.commentCount += 1
    var commentMap = this.commentMap[messageId]
    console.log('in addComment ' + this.commentMap + ' ' + commentMap)
    if (commentMap) {
      console.log('commentMap is available')
      commentMap.add(commentId)
    } else {
      console.log('commentMap is not available')
      commentMap = new CommentMap()
      commentMap.add(commentId)
      this.commentMap.put(messageId, commentMap)
    }
    this.commentMap.put(messageId, commentMap)

    var comment = new Comment()
    comment.messageId = messageId
    comment.sender = Blockchain.transaction.from
    comment.content = content

    this.comments.put(commentId, comment)
    return commentId
  },
  getComments: function (messageId) {
    var commentMap = this.commentMap.get(messageId)
    var comments = []
    for (var i = 0; i < commentMap.count(); i++) {
      comments.push(this.comments[commentMap.get(i)])
    }
    return {
      'error': null,
      'messageId': messageId,
      'comments': comments
    }
  },
  debug: function () {
    return JSON.stringify(this)
  }

}

module.exports = MessageBoardContract
