import Chart from 'chart.js/auto'
import 'chartjs-adapter-moment'
import './OHLCBubbleController.js'

export default class BubbleTradeChart {
  constructor(chartContext, config, updateTradesCallback, setLoading, logMessage) {
    this.ctx = chartContext
    this.config = config
    this.buyHistory = []
    this.sellHistory = []
    this.ohlc = []
    this.trades = []
    this.lastBuy = null
    this.lastSell = null
    this.lastOHLC = null
    this.averageMinuteVolume = 1000
    this.lastUpdate = 0
    this.apiUrl = `https://api.binance.com/api/v3`
    this.socketUrl = `wss://stream.binance.com:9443/ws/${this.config.symbol.toLowerCase()}@aggTrade`
    this.updateTradesCallback = updateTradesCallback ?? (() => {})
    this.setLoading = setLoading ?? (() => {})
    this.log =
      logMessage ??
      ((message, level) => {
        if (level === 'error') {
          console.error(message)
          return
        }
        if (level === 'warn') {
          console.warn(message)
          return
        }
        if (level === 'info') {
          console.info(message)
          return
        }
        if (level === 'debug') {
          console.debug(message)
          return
        }
        if (level === 'trace') {
          console.trace(message)
          return
        }
        console.log(message)
      })
    this.initChart()
  }

  async start() {
    this.setLoading(true) // Show loading overlay
    this.trades = [] // Clear previous trades when starting new data fetch

    await this.fetchAverageMinuteVolume()
    await this.fetchAggTrades(this.config.apiLimit)

    this.setLoading(false) // Hide loading overlay
    this.setupWebSocket()
  }

  stop() {
    this.trades = [] // Clear trades
    if (this.updateTradesCallback) {
      this.updateTradesCallback([]) // Reset trade data in UI
    }
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  async fetchAverageMinuteVolume() {
    const klineUrl = `${this.apiUrl}/klines?symbol=${this.config.symbol}&interval=1m&limit=1440`
    try {
      const response = await fetch(klineUrl)
      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) {
        this.log('Invalid Kline data', 'error')
        return
      }
      // Calculate the average minute volume from 1440 minutes (24 hours)
      const totalVolume = data.reduce((sum, kline) => sum + parseFloat(kline[5]), 0)
      this.averageMinuteVolume = totalVolume / data.length
      this.log(`Calculated 24-hour Average Minute Volume: ${this.averageMinuteVolume}`, 'info')
    } catch (error) {
      this.log(`Error fetching 24-hour average minute volume:${error}`, 'error')
    }
  }

  async fetchAggTrades(limit = 10000) {
    let allTrades = []
    let endTime = Date.now() // Start from the current time
    let startTime = endTime - this.config.historyHours * 60 * 60 * 1000 // Go back X hours

    try {
      while (allTrades.length < limit) {
        let fetchLimit = Math.min(1000, limit - allTrades.length)
        let url = `${this.apiUrl}/aggTrades?symbol=${this.config.symbol}&limit=${fetchLimit}&endTime=${endTime}`

        const response = await fetch(url)
        const trades = await response.json()

        if (!Array.isArray(trades) || trades.length === 0) {
          this.log('No more historical aggTrades available.', 'warn')
          break
        }

        allTrades = [...trades, ...allTrades] // Append new trades at the beginning
        endTime = trades[0].T // Move backwards in time

        if (endTime < startTime) {
          this.log('Reached configured historical time limit.', 'info')
          break
        }

        this.log(`Fetched ${allTrades.length} aggTrades so far...`, 'info')

        // Prevent API rate limits (1 request per 500ms)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      allTrades = allTrades.filter((x) => x.T > startTime)
      // Process all fetched trades
      allTrades.forEach((trade) => this.processTrade(trade, false))
      this.updateChart()
      this.log(`Total fetched trades: ${allTrades.length}`, 'debug')
    } catch (error) {
      this.log(`Error fetching historical aggTrades:${error}`, 'error')
    }
  }

  getRadius(volume) {
    return Math.max(1, Math.min(10, (volume / this.averageMinuteVolume) * 5 || 1))
  }

  roundToMinute(timestamp) {
    return Math.floor(timestamp / 60000) * 60000
  }

  processTrade(data) {
    if (!data?.p || !data?.q) return

    const price = parseFloat(data.p)
    const volume = parseFloat(data.q)
    const side = data.m ? 'Sell' : 'Buy'
    const time = this.roundToMinute(data.T || Date.now())
    const newTrade = {
      x: time,
      y: price,
      r: this.getRadius(volume),
      q: volume,
      orders: 1,
      side }
    const newOHLC = {
      x:time,
      y:price,
      o:price,
      h:price,
      l:price,
      c:price,
      q:volume,
    }
    const lastTrade = side === 'Buy' ? this.lastBuy : this.lastSell
    const history = side === 'Buy' ? this.buyHistory : this.sellHistory

    if (lastTrade?.x === time) {
      lastTrade.price = (lastTrade.price + price) / 2
      lastTrade.q += volume
      lastTrade.orders += 1
      lastTrade.r = this.getRadius(lastTrade.q)
    } else {
      if (lastTrade) history.push(lastTrade)
      side === 'Buy' ? (this.lastBuy = newTrade) : (this.lastSell = newTrade)
    }

    if(this.lastOHLC?.x===time){
      this.lastOHLC.h=this.lastOHLC.h>price?this.lastOHLC.h:price
      this.lastOHLC.l=this.lastOHLC.l<price?this.lastOHLC.l:price
      this.lastOHLC.c=price
      this.lastOHLC.q += volume
    } else{
      if (this.lastOHLC) this.ohlc.push(this.lastOHLC)
      this.lastOHLC = newOHLC;
    }

    if (history.length > this.config.historyHours * 60) history.shift()
    this.tradeChart.data.datasets[0].data = [...this.buyHistory, this.lastBuy].filter(Boolean)
    this.tradeChart.data.datasets[1].data = [...this.sellHistory, this.lastSell].filter(Boolean)
    this.tradeChart.data.datasets[2].data = [...this.ohlc, this.lastOHLC].filter(Boolean)

    this.trades.unshift({ price, volume, side, time: new Date().toLocaleTimeString() })
    if (this.trades.length > this.config.historicTradesLimit) this.trades.pop()
  }

  initChart() {
    this.tradeChart = new Chart(this.ctx, {
      data: {
        datasets: [
          {
            type: 'bubble',
            label: 'Buy Orders',
            data: [],
            backgroundColor: this.config.colors.buy.fill,
            borderColor: this.config.colors.buy.border,
            borderWidth: 1,
          },
          {
            type: 'bubble',
            label: 'Sell Orders',
            data: [],
            backgroundColor: this.config.colors.sell.fill,
            borderColor: this.config.colors.sell.border,
            borderWidth: 1,
          },
          {
            type: 'OHLCBubble',
            label: 'Candles',
            data: [],
            bullColor: this.config.colors.buyCandle.fill,
            bearColor: this.config.colors.sellCandle.fill,
            bullBorderColor: this.config.colors.buyCandle.border,
            bearBorderColor: this.config.colors.sellCandle.border,
            borderWidth: 1,
          }
        ],
      },
      options: {
        //animation: { duration: 1000, easing: 'easeOutQuad' },
        scales: {
          x: {
            type: 'time',
            time: { unit: 'minute', tooltipFormat: 'HH:mm', displayFormats: { minute: 'HH:mm' } },
            title: { display: true, text: 'Time' },
            ticks: { autoSkip: true, font: { size: 10 }, maxRotation: 90, minRotation: 90 },
          },
          y: { title: { display: true, text: 'Price' } },
        },
        plugins: {
          legend: { display: true },
          tooltip: { callbacks: { label: ({ raw }) => `Price: ${raw.y} Qty: ${raw.q}` } },
        },
      },
    })

  }

  updateChart() {
    const now = Date.now()
    if (now - this.lastUpdate >= this.config.updateIntervalMs) {
      this.lastUpdate = now
      this.tradeChart.update()
      this.updateTradesCallback([...this.trades]) // Pass a new array to trigger reactivity
    }
  }

  setupWebSocket() {
    this.socket = new WebSocket(this.socketUrl)
    this.socket.onmessage = ({ data }) => {
      try {
        this.processTrade(JSON.parse(data))
        this.updateChart()
      } catch (error) {
        this.log(`WebSocket Error:${error}`, 'error')
      }
    }
    this.socket.onopen = () =>
      this.log(`WebSocket connected to ${this.config.symbol} aggTrade`, 'info')
    this.socket.onerror = (ev) => this.log(`WebSocket Error: ${ev.message}`, 'error')
    this.socket.onclose = () => this.log('WebSocket closed', 'info')
  }

  destroy() {
    this.stop()
    if (this.tradeChart) {
      this.tradeChart.destroy()
    }
  }
}
