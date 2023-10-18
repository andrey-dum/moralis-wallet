import axios from 'axios'

export const tokensApi = {
  async getTokens(params: {
    userAddress: string,
    chain: string
  }) {
    const { userAddress, chain} = params
    return await axios.get(`http://localhost:5000/tokens`, {
      params: {
        userAddress,
        chain
      }
    });
  }
}
