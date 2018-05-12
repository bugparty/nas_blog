'use strict'

var Comment = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.messageId = o.messageId
    this.sender = o.sender
    this.content = o.content
    this.commentId = o.commentId

  } else {
    this.messageId = 0
    this.sender = ""
    this.content = ""
    this.commentId = 0
  }
};


Comment.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var CommentMap = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.data = o.data;
  } else {
    data = []
  }
}

CommentMap.prototype = {
  toString: function () {
    return JSON.stringify(this);
  },
  add: function (commentId) {
    this.data.push(commentId)
  },
  count: function () {
    return this.data.length
  },
  getAll: function () {
    return this.data
  }
}




var Message = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.messageId = o.messageId
    this.sender = o.sender
    this.content = o.content
  } else {
    this.messageId = 0
    this.sender = ""
    this.content = ""
  }
};

Message.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var MessageBoardContract = function () {
  LocalContractStorage.defineMapProperty(this, "messages", {
    parse: function (text) {
      return new Message(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  })
  LocalContractStorage.defineMapProperty(this, "comments", {
    parse: function (text) {
      return new Comment(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  })
  LocalContractStorage.defineMapProperty(this, "commentMap", {
    parse: function (text) {
      return new CommentMap(text);
    },
    stringify: function (o) {
      return o.toString();
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

  addMessage: function (content) {
    var messageId = this.messageCount + 1
    this.messageCount+=1
    var msg = new Message()
    msg.messageId = messageId
    msg.sender =   Blockchain.transaction.from
    msg.content =  content
    this.messages.put(messageId, msg);
    return messageId;
  },

  addComment: function (messageId, content) {
    var commentId = this.commentCount + 1
    this.commentCount+=1
    var commentMap = this.commentMap[messageId]
    if (commentMap) {
      commentMap.add(commentId)
    } else {
      commentMap = new CommentMap();
      commentMap.add(commentId)
    }
    this.commentMap.put(messageId, commentMap);
    
    var comment = new Comment()
    comment.messageId = messageId
    comment.sender =   Blockchain.transaction.from
    comment.content =  content
    
    this.comments.put(messageId, comment);
    return commentId;
  },
  getComments: function (messageId) {
    var commentMap = this.commentMap.get(messageId)
    var comments = []
    
  }

}

module.exports = MessageBoardContract

