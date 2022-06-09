// Description:
//   Obtiene info del clima desde donde el usuario haga la consulta, la manda
//   a Wttr.in y muestra el resultado en Slack.
//
// Dependencies:
//   None
//
// Commands:
//   hubot clima <ciudad> | default: Santiago
//
// Author:
//   @

module.exports = robot => {
  robot.respond(/clima\s?(.*)/i, msg => {
    const city = msg.match[1] || 'Santiago'
    robot
      .http(`http://wttr.in/${city}?m`)
      .header('Accept', '*/*')
      .header('User-Agent', 'curl/7.43.0')
      .get()((err, res, body) => {
        if (err || res.statusCode !== 200 || body === 'ERROR' || /sorry/gi.test(body)) {
          if (err) robot.emit('error', err, msg)
          return msg.reply('ocurrió un error con la búsqueda')
        }
        const raw = body.split('\n')
        const idx = raw.findIndex(el => /\s+┌─────────────┐\s+/.test(el))
        const result = raw
          .slice(0, idx)
          .map(text => text.replace(/\[(\d+)?(;\d+)?(;\d+)?(m)?/g, ''))
          .join('\n')
        msg.send('```' + result + '```')
      })
  })
}
