const nodemailer = require('nodemailer')
const mailGunTransport = require('nodemailer-mailgun-transport')
const Mailgen = require('mailgen')
const UserService = require('../controllers/users-service')
const moment = require('moment')

function sendEMail(content) {
  const auth = {
    auth: {
      api_key: process.env.EMAIL_API_KEY,
      domain: process.env.DOMAIN_NAME,
    },
  }

  var nodemailerMailgun = nodemailer.createTransport(mailGunTransport(auth))

  // Configure mailgen by setting a theme and your product info
  const mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
      name: 'Olalere Law Office',
      link: process.env.HOST,
      logo: 'https://res.cloudinary.com/dvxellcx5/image/upload/v1546629164/logoSmall.png',
    },
  })

  nodemailerMailgun.sendMail(
    {
      from: process.env.SENDER_EMAIL,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'Daily user follow up',
      html: mailGenerator.generate(content),
      text: mailGenerator.generatePlaintext(content),
    },
    function(err) {
      if (err) return console.log(err)
      console.log('Message sent successfully.')
    },
  )
}

function generateEmailText(users) {
  return (email = {
    body: {
      name: 'Olalere',
      intro:
        'This is the list of the users to follow-up with today, ' +
        moment(new Date()).format('MMMM Do YYYY') +
        '.',
      table: {
        data: users,
      },
      action: {
        instructions: 'You can check more information about these users in your dashboard:',
        button: {
          color: '#3869D4',
          text: 'Go to Dashboard',
          link: process.env.HOST + '/dashboard',
        },
      },
    },
  })
}

async function sendDailyEmail() {
  let users = await UserService.findUsersToFollowupWithToday()

  if (users && users.length > 0) {
    users = users.map(function(user) {
      return {
        'Last name': user.lastname,
        'Given names': user.givenNames,
        'Purpose Of Follow-up': user.purposeOfFollowup,
        email: user.email,
      }
    })

    const emailContent = generateEmailText(users)
    sendEMail(emailContent)
  }
}

module.exports = {
  sendDailyEmail,
}
