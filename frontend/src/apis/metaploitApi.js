import { request } from "./request";

export const metasploitApi = {
  getInformations: () => {
    return request({
      method: "GET",
      url: "/api/v1/module_information",
    });
  },

  createExploit: (rhosts) => {
    return request({
      method: "POST",
      url: "/api/v1/run_exploit",
      data: {
        rhosts: rhosts,
      },
    });
  },

  sendCommand: (message) => {
    return request({
      method: "POST",
      url: "/api/v1/command",
      data: {
        message: message,
      },
    });
  },
};
