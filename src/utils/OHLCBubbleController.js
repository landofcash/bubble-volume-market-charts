import { BubbleController } from 'chart.js'
import Chart from 'chart.js/auto'

class OHLCBubbleController extends BubbleController {
  draw() {
    // Now we can do some custom drawing for this dataset. Here we'll draw a red box around the first point in each dataset
    const meta = this.getMeta()
    const xScale = this.chart.scales.x
    const yScale = this.chart.scales.y
    meta.data.forEach((point, index) => {
      const dataset = this.getDataset()
      const colors = {
        bullColor: dataset.bullColor || 'green',
        bearColor: dataset.bearColor || 'red',
        bullBorderColor: dataset.bullBorderColor || 'green',
        bearBorderColor: dataset.bearBorderColor || 'red',
      }
      const item = dataset.data[index]
      const x = xScale.getPixelForValue(item.x)
      const o = yScale.getPixelForValue(item.o)
      const h = yScale.getPixelForValue(item.h)
      const l = yScale.getPixelForValue(item.l)
      const c = yScale.getPixelForValue(item.c)
      const ctx = this.chart.ctx
      this.drawCandle(ctx, x, o, h, l, c, 4, colors)
    })
  }

  drawCandle(ctx, x, o, h, l, c, bodyWidth, colors) {
    ctx.save()
    const isBullish = o > c // Inverted because of pixel coordinates
    ctx.strokeStyle = isBullish ? colors.bullBorderColor : colors.bearBorderColor
    ctx.fillStyle = isBullish ? colors.bullColor : colors.bearColor
    ctx.lineWidth = 1

    ctx.beginPath();
    ctx.moveTo(x, h);
    ctx.lineTo(x, Math.min(o, c));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, Math.max(o, c));
    ctx.lineTo(x, l);
    ctx.stroke();

    // **Draw the candlestick body**
    const bodyTop = Math.min(o, c);
    const bodyBottom = Math.max(o, c);
    const bodyHeight = bodyBottom - bodyTop;

    // Fill the body (rectangle)
    ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);

    // Draw the border around the body
    ctx.strokeRect(x - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);

    ctx.restore()
  }
}
OHLCBubbleController.id = 'OHLCBubble'
OHLCBubbleController.defaults = BubbleController.defaults
Chart.register(OHLCBubbleController)
