const express = require('express');
const app = express();
const cors = require('cors')
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key')
const { User } = require('./models/User');
const { auth } = require('./middleware/auth')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,  // cookie 전달하는 설정
}));

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => {
  console.log('...database connected successfully!')
}).catch((error) => {
  console.error(error)
})



app.get('/', (req, res) => {
  res.status(200).send('connected server-side app')
})

app.post('/api/user/register', (req, res) => {
  User.findOne({ email: req.body.email }, (error, user) => {
    if (error) return res.status(400).json({ success: false, error })
    if (user) {
      return res.status(401).send('이미 존재하는 사용자입니다.');
    } else {
      const user = new User(req.body);
      user.save((error, doc) => {
        if (error) return res.status(400).json({ success: false, error })
        return res.status(200).json({ success: true })
      })
    }
  })
})

app.post('/api/user/login', (req, res) => {

  User.findOne({ email: req.body.email }, (error, user) => {
    if (error) {
      return res.status(401).send('존재하지 않는 사용자입니다.');
    }

    user.comparePassword(req.body.password, (error, isMatch) => {
      if (error) return res.status(400).json({ success: false, error })
      if (!isMatch) {
        return res.status(400).send('비밀번호가 일치하지 않습니다.');
      }
      user.generateToken((error, user) => {
        if (error) return res.status(400).send(error);

        // cookie에 저장
        res.cookie('x_auth', user.token).status(200)
          .json({ success: true, userId: user._id });
      })
    })
  })
})

app.get('/api/user/auth', auth, (req, res) => {
  const isAdmin = (role) => {
    switch (role) {
      case 0:
        //0은 총괄 어드민
        return true;
      default:
        return false;
    }
  }
  res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    image: req.user.image,
    role: req.user.role,
    isAdmin: isAdmin(req.user.role),
    isAuth: true
  })
})

app.get('/api/user/logout', auth, (req, res) => {

  User.findOneAndUpdate({ _id: req.user._id, },
    { token: '' },
    (error, user) => {
      if (error) return res.status(400).json({ success: false, error })
      res.cookie('x_auth', '').status(200)
        .json({ success: true });
    })
})

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})