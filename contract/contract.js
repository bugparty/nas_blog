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
  get: function (index) {
    return this.data[index]
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
    return {'error': null,
      'message': msg,
      'comments': null}
  },

  addComment: function (messageId, content) {
    this.commentCount += 1
    var commentId = this.commentCount
    console.log('addComment commentId: '+ commentId)

    var commentMapObj = this.commentMap.get(messageId)
    console.log('in addComment ' + JSON.stringify(this.commentMap))
    if (commentMapObj) {
      console.log('commentMap is available')
      commentMapObj.add(commentId)
    } else {
      console.log('commentMap is not available')
      commentMapObj = new CommentMap()
      console.log('commentMapObj:' + JSON.stringify(commentMapObj))
      commentMapObj.add(commentId)
    }
    this.commentMap.put(messageId, commentMapObj)

    var comment = new Comment()
    comment.messageId = messageId
    comment.sender = Blockchain.transaction.from
    comment.content = content
    comment.commentId = commentId
    console.log('put comment id:'+ commentId + ' content: '+ JSON.stringify(comment))
    this.comments.put(commentId, comment)
    return commentId
  },
  getComments: function (messageId) {
    var commentMap = this.commentMap.get(messageId)
    console.log('has ' + commentMap.count() + ' comments')

    var comments = []
    for (var i = 0; i < commentMap.count(); i++) {
      var commentId = commentMap.get(i)
      console.log('comment id: ' + commentId)

      comments.push(this.comments.get(commentId))
    }
    return {
      'error': null,
      'messageId': messageId,
      'comments': comments
    }
  },
  debug: function () {
    var msgs = []
    var maps = []
    for (var i = 1; i <= this.messageCount; i++) {
      msgs.push(this.messages.get(i))
      maps.push(this.commentMap.get(i))
    }
    var comms = []
    for (var j = 1; j <= this.commentCount; j++) {
      comms.push(this.comments.get(j))
    }
    return {'d': JSON.stringify(this),
      'msgs': JSON.stringify(msgs),
      'comms': JSON.stringify(comms),
      'maps': JSON.stringify(maps)
    }
  }

}

module.exports = MessageBoardContract
