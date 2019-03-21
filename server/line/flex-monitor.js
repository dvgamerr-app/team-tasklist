module.exports = () => {
  
  return {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: '[WARNING]',
              weight: 'bold',
              color: '#ff9800',
              size: 'sm',
              flex: 0
            },
            {
              type: 'text',
              text: '-',
              color: '#FFFFFF',
              flex: 0
            },
            {
              type: 'text',
              text: 'Mornitor Daily Close',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        {
          type: 'separator',
          margin: 'sm'
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'sm',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'IIS Services',
                  color: '#333333',
                  weight: 'bold',
                  size: 'xxs',
                  flex: 12
                },
                {
                  type: 'text',
                  text: 'PASS',
                  wrap: true,
                  color: '#1DB446',
                  weight: 'bold',
                  size: 'xxs',
                  align: 'end',
                  flex: 2
                }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  color: '#333333',
                  text: 'FTP Connection',
                  weight: 'bold',
                  size: 'xxs',
                  flex: 12
                },
                {
                  type: 'text',
                  text: 'WARN',
                  wrap: true,
                  color: '#FF9800',
                  weight: 'bold',
                  size: 'xxs',
                  align: 'end',
                  flex: 2
                }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'xs',
              contents: [
                {
                  type: 'text',
                  text: ' ',
                  flex: 1
                },
                {
                  type: 'text',
                  text: 'รอไฟล์',
                  wrap: true,
                  color: '#999999',
                  weight: 'bold',
                  size: 'xxs',
                  flex: 24
                }
              ]
            }
          ]
        },
        {
          type: 'separator',
          margin: 'sm'
        },
        {
          type: 'box',
          layout: 'horizontal',
          margin: 'md',
          contents: [
            {
              type: 'text',
              text: '21 Mar 2019, 09:50',
              color: '#666666',
              size: 'xxs'
            },
            {
              type: 'text',
              text: 'Kananek Thongkam',
              color: '#aaaaaa',
              size: 'xxs',
              align: 'end'
            }
          ]
        }
      ]
    }
  }
}