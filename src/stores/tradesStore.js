import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTradesStore = defineStore('tradesStore', () => {
  const trades = ref([])
  const symbol = ref("ALGOUSDT") // Default symbol

  const setSymbol = (newSymbol) => {
    symbol.value = newSymbol
    trades.value = [] // Clear trades when switching symbols
  }

  return { trades, symbol, setSymbol }
})
