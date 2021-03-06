const mongoose = require("mongoose");
const PostSchema = require("./post");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: name => name.length > 2,
      message: "Name must be longer than 2 characters."
    },
    required: [true, "Name is required."]
  },
  posts: [PostSchema],
  likes: Number,
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "blogPost"
    }
  ]
});

// use function() to make "this" reffer to "joe"
UserSchema.virtual("postCount").get(function() {
  return this.posts.length;
});

// remove blogpost when user is removed
UserSchema.pre("remove", function(next) {
  const BlogPost = mongoose.model("blogPost");
  // this === joe
  // remove all the blogPosts belong to joe
  BlogPost.remove({ _id: { $in: this.blogPosts } }).then(() => next());
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
