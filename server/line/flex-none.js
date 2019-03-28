const moment = require('moment')

module.exports = (msg) => {
  let topName = `Monitor DailyClose`
  let topDate = moment().format('HH:mm, DD MMM YYYY')

  let flexMessage = {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            { type: 'text', text: topName, weight: 'bold', size: 'sm' }
          ]
        },
        { type: 'separator', margin: 'sm' },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'xl',
          contents: [
            { type: 'text', text: msg, wrap: true, color: '#333333', weight: 'bold', size: 'sm', align: 'center', flex: 12 }
          ]
        },
        { type: 'separator', margin: 'lg' },
        {
          type: 'box',
          layout: 'horizontal',
          margin: 'md',
          contents: [
            { type: 'text', text: topDate, color: '#666666', size: 'xxs' },
            { type: 'text', text: 'Schedule', color: '#aaaaaa', size: 'xxs', align: 'end' }
          ]
        }
      ]
    }
  }

  
  return {
    type: 'flex',
    altText: msg,
    contents: flexMessage
  }
}